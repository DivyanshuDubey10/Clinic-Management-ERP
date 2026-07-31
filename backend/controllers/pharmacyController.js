const Medicine = require('../models/Medicine');
const Purchase = require('../models/Purchase');
const Prescription = require('../models/Prescription');

// @desc    Add a new medicine to catalog
// @route   POST /api/pharmacy/medicines
// @access  Private (Admin)
const addMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.create(req.body);
        res.status(201).json({ success: true, data: medicine });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all medicines (Item Master)
// @route   GET /api/pharmacy/medicines
// @access  Private
const getMedicines = async (req, res) => {
    try {
        // Will include virtual 'totalStock'
        const medicines = await Medicine.find().sort({ name: 1 });
        const data = medicines.map(m => m.toJSON());
        res.status(200).json({ success: true, count: medicines.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Record Stock-In / Purchase
// @route   POST /api/pharmacy/purchase
// @access  Private (Admin)
const recordPurchase = async (req, res) => {
    try {
        const { supplierName, invoiceNumber, items, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide items' });
        }

        let totalAmount = 0;

        // Verify medicines exist and calculate total
        for (const item of items) {
            const medicine = await Medicine.findById(item.medicineId);
            if (!medicine) {
                return res.status(404).json({ success: false, message: `Medicine not found for ID: ${item.medicineId}` });
            }
            totalAmount += (item.purchasePrice * item.quantity);
        }

        // Create Purchase record
        const purchase = await Purchase.create({
            supplierName,
            invoiceNumber,
            items,
            totalAmount,
            notes
        });

        // Automatically update batches in the Medicine catalog
        for (const item of items) {
            const medicine = await Medicine.findById(item.medicineId);
            medicine.batches.push({
                batchNumber: item.batchNumber,
                quantity: item.quantity,
                expiryDate: item.expiryDate,
                purchasePrice: item.purchasePrice
            });
            await medicine.save();
        }

        res.status(201).json({ success: true, data: purchase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Dispense Against Prescription
// @route   POST /api/pharmacy/dispense/:prescriptionId
// @access  Private (Admin, Receptionist)
const dispensePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.prescriptionId);
        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        if (prescription.status === 'Dispensed') {
            return res.status(400).json({ success: false, message: 'Prescription already dispensed' });
        }

        let itemsToDispense = req.body.dispenseItems;

        // if (!itemsToDispense || itemsToDispense.length === 0) {
        //     // Derive items from prescription
        //     itemsToDispense = prescription.medications
        //         .filter(med => med.medicineId) // Only medications linked to item master
        //         .map(med => ({
        //             medicineId: med.medicineId,
        //             requestedQuantity: med.requestedQuantity || 1 // default to 1 if not specified
        //         }));
        // }


        if (!itemsToDispense || itemsToDispense.length === 0) {

            itemsToDispense = [];

            for (const med of prescription.medications) {

                let medicineId = med.medicineId;

                // If medicineId wasn't saved, find it using drug name
                if (!medicineId) {
                    const medicine = await Medicine.findOne({
                        name: { $regex: `^${med.drugName}$`, $options: "i" }
                    });

                    if (!medicine) {
                        return res.status(404).json({
                            success: false,
                            message: `Medicine '${med.drugName}' not found in inventory`
                        });
                    }

                    medicineId = medicine._id;
                }

                itemsToDispense.push({
                    medicineId,
                    requestedQuantity: med.requestedQuantity || 1
                });
            }
        }

        if (!itemsToDispense || itemsToDispense.length === 0) {
            console.error("Dispense Error: No valid items to dispense. Frontend sent:", req.body.dispenseItems, "Prescription meds:", prescription.medications);
            return res.status(400).json({ success: false, message: 'Please provide items to dispense or ensure prescription has valid medicines linked.' });
        }

        // Validate stock availability before deducting anything
        const now = new Date();
        for (const item of itemsToDispense) {
            const medicine = await Medicine.findById(item.medicineId);
            if (!medicine) {
                return res.status(404).json({ success: false, message: `Medicine ${item.medicineId} not found` });
            }

            if (medicine.totalStock < item.requestedQuantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient stock for ${medicine.name}. Required: ${item.requestedQuantity}, Available: ${medicine.totalStock}`
                });
            }
        }

        // Perform auto-deduction (FIFO - oldest expiry first)
        for (const item of itemsToDispense) {
            const medicine = await Medicine.findById(item.medicineId);
            let remainingToDeduct = item.requestedQuantity;

            // Sort batches by closest expiry date first (only non-expired)
            const validBatches = (medicine.batches || [])
                .filter(b => b.expiryDate > now && b.quantity > 0)
                .sort((a, b) => a.expiryDate - b.expiryDate);

            for (let i = 0; i < validBatches.length; i++) {
                if (remainingToDeduct <= 0) break;

                const batch = medicine.batches.id(validBatches[i]._id);

                if (batch.quantity >= remainingToDeduct) {
                    batch.quantity -= remainingToDeduct;
                    remainingToDeduct = 0;
                } else {
                    remainingToDeduct -= batch.quantity;
                    batch.quantity = 0; // Depleted this batch
                }
            }

            // Also deduct from flat stock property since it's now exposed to frontend
            if (medicine.stock !== undefined) {
                medicine.stock -= item.requestedQuantity;
                if (medicine.stock < 0) medicine.stock = 0;
            }

            await medicine.save();
        }

        // Mark prescription as Dispensed
        prescription.status = 'Dispensed';
        await prescription.save();

        res.status(200).json({ success: true, message: 'Medicines dispensed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Low-Stock & Expiry Alerts
// @route   GET /api/pharmacy/alerts
// @access  Private (Admin, Receptionist)
const getAlerts = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        
        const lowStockAlerts = [];
        const expiryAlerts = [];
        
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        medicines.forEach(med => {
            // Check Low Stock
            if (med.totalStock < med.reorderThreshold) {
                lowStockAlerts.push({
                    medicineId: med._id,
                    name: med.name,
                    totalStock: med.totalStock,
                    threshold: med.reorderThreshold
                });
            }

            // Check Expiries
            med.batches.forEach(batch => {
                if (batch.quantity > 0 && batch.expiryDate <= thirtyDaysFromNow) {
                    expiryAlerts.push({
                        medicineId: med._id,
                        name: med.name,
                        batchNumber: batch.batchNumber,
                        quantity: batch.quantity,
                        expiryDate: batch.expiryDate,
                        status: batch.expiryDate < now ? 'Expired' : 'Expiring Soon'
                    });
                }
            });
        });

        res.status(200).json({
            success: true,
            data: [...lowStockAlerts, ...expiryAlerts]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().populate('items.medicineId', 'name genericName').sort({ purchaseDate: -1 });
        res.status(200).json({ success: true, count: purchases.length, data: purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single purchase by ID
// @route   GET /api/pharmacy/purchases/:id
// @access  Private (Admin, Receptionist)
const getPurchaseById = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id).populate('items.medicineId', 'name genericName category');
        if (!purchase) {
            return res.status(404).json({ success: false, message: 'Purchase not found' });
        }
        res.status(200).json({ success: true, data: purchase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all pending prescriptions for pharmacy to dispense
// @route   GET /api/pharmacy/prescriptions/pending
// @access  Private (Admin, Receptionist)
const getPendingPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ status: 'Pending' })
            .populate('patientId', 'firstName lastName')
            .populate('doctorId', 'name')
            .sort({ createdAt: 1 });
            
        res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single prescription by ID
// @route   GET /api/pharmacy/prescriptions/:id
// @access  Private (Admin, Receptionist)
const getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id).populate("medications.medicineId")
            .populate('patientId', 'firstName lastName phone')
            .populate('doctorId', 'name specialization');
            
        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }
        res.status(200).json({ success: true, data: prescription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }
        res.status(200).json({ success: true, data: medicine });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }
        res.status(200).json({ success: true, data: medicine });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addMedicine,
    getMedicines,
    recordPurchase,
    dispensePrescription,
    getAlerts,
    getPurchases,
    getPurchaseById,
    getPendingPrescriptions,
    getPrescriptionById,
    getMedicineById,
    updateMedicine,
    deleteMedicine
};
