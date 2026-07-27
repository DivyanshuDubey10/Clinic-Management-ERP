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
        res.status(200).json({ success: true, count: medicines.length, data: medicines });
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

        const { dispenseItems } = req.body; 
        // Array of { medicineId, requestedQuantity }

        if (!dispenseItems || dispenseItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide items to dispense' });
        }

        // Validate stock availability before deducting anything
        const now = new Date();
        for (const item of dispenseItems) {
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
        for (const item of dispenseItems) {
            const medicine = await Medicine.findById(item.medicineId);
            let remainingToDeduct = item.requestedQuantity;

            // Sort batches by closest expiry date first (only non-expired)
            const validBatches = medicine.batches
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
            data: {
                lowStockAlerts,
                expiryAlerts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addMedicine,
    getMedicines,
    recordPurchase,
    dispensePrescription,
    getAlerts
};
