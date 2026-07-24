const Razorpay = require('razorpay');
const crypto = require('crypto');
const Invoice = require('../models/Invoice');
const Patient = require('../models/Patient');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a new invoice
// @route   POST /api/billing/invoices
// @access  Private (Admin, Receptionist)
exports.createInvoice = async (req, res) => {
    try {
        const { patientId, consultationId, items, tax = 0, discount = 0, insuranceDetails } = req.body;

        if (!patientId || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Patient ID and at least one item are required' });
        }

        // Calculate totals
        let subTotal = 0;
        const processedItems = items.map(item => {
            const total = item.quantity * item.unitPrice;
            subTotal += total;
            return {
                ...item,
                total
            };
        });

        const taxAmount = (subTotal * tax) / 100;
        const grandTotal = subTotal + taxAmount - discount;

        const invoice = await Invoice.create({
            patientId,
            consultationId,
            items: processedItems,
            billingDetails: {
                subTotal,
                tax: taxAmount,
                discount,
                grandTotal,
                amountPaid: 0,
                amountDue: grandTotal
            },
            insuranceDetails,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get all invoices
// @route   GET /api/billing/invoices
// @access  Private (Admin, Receptionist)
exports.getAllInvoices = async (req, res) => {
    try {
        const { patientId, status, page = 1, limit = 10 } = req.query;
        let query = {};

        if (patientId) query.patientId = patientId;
        if (status) query.status = status;

        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const total = await Invoice.countDocuments(query);

        const invoices = await Invoice.find(query)
            .populate({ path: 'patientId', select: 'firstName lastName patientId' })
            .skip(startIndex)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: invoices.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            data: invoices
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get invoice by ID
// @route   GET /api/billing/invoices/:id
// @access  Private (Admin, Receptionist, Patient)
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate({ path: 'patientId', select: 'firstName lastName patientId phone email' });

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Create Razorpay order for online payment
// @route   POST /api/billing/invoices/:id/razorpay-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        if (invoice.billingDetails.amountDue <= 0) {
            return res.status(400).json({ success: false, message: 'Invoice is already fully paid' });
        }

        // Razorpay accepts amount in paise (multiply by 100)
        const amountInPaise = Math.round(invoice.billingDetails.amountDue * 100);

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: invoice.invoiceNumber
        };

        const order = await razorpay.orders.create(options);

        // Save order ID to invoice
        invoice.razorpayOrderId = order.id;
        await invoice.save();

        res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error creating Razorpay order' });
    }
};

// @desc    Verify Razorpay online payment
// @route   POST /api/billing/invoices/:id/verify-payment
// @access  Private
exports.verifyOnlinePayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const invoiceId = req.params.id;

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed (Invalid signature)' });
        }

        // Fetch payment details from Razorpay to get the actual amount paid
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        const amountPaid = paymentDetails.amount / 100; // Convert paise back to Rupees

        // Record payment
        invoice.paymentHistory.push({
            date: new Date(),
            amount: amountPaid,
            method: 'Online',
            transactionId: razorpay_payment_id,
            receiptNumber: `REC-${Date.now()}`
        });

        invoice.billingDetails.amountPaid += amountPaid;
        invoice.billingDetails.amountDue = invoice.billingDetails.grandTotal - invoice.billingDetails.amountPaid;

        // Update status
        if (invoice.billingDetails.amountDue <= 0) {
            invoice.status = 'Paid';
        } else {
            invoice.status = 'Partial';
        }

        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified and recorded successfully',
            data: invoice
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Record manual payment (Cash, Card, UPI)
// @route   POST /api/billing/invoices/:id/manual-payment
// @access  Private (Admin, Receptionist)
exports.recordManualPayment = async (req, res) => {
    try {
        const { amount, method, transactionId } = req.body;
        const invoiceId = req.params.id;

        if (!amount || !method) {
            return res.status(400).json({ success: false, message: 'Amount and payment method are required' });
        }

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        if (invoice.billingDetails.amountDue <= 0) {
            return res.status(400).json({ success: false, message: 'Invoice is already fully paid' });
        }

        // Record payment
        invoice.paymentHistory.push({
            date: new Date(),
            amount: Number(amount),
            method: method,
            transactionId: transactionId || null,
            receiptNumber: `REC-${Date.now()}`
        });

        invoice.billingDetails.amountPaid += Number(amount);
        invoice.billingDetails.amountDue = invoice.billingDetails.grandTotal - invoice.billingDetails.amountPaid;

        // Ensure due amount doesn't go negative due to overpayment
        if (invoice.billingDetails.amountDue < 0) {
             invoice.billingDetails.amountDue = 0;
        }

        // Update status
        if (invoice.billingDetails.amountDue === 0) {
            invoice.status = 'Paid';
        } else {
            invoice.status = 'Partial';
        }

        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Manual payment recorded successfully',
            data: invoice
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Update insurance claim status
// @route   PUT /api/billing/invoices/:id/insurance
// @access  Private (Admin, Receptionist)
exports.updateInsuranceClaim = async (req, res) => {
    try {
        const { claimStatus, claimAmount } = req.body;
        
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        if (claimStatus) invoice.insuranceDetails.claimStatus = claimStatus;
        if (claimAmount !== undefined) invoice.insuranceDetails.claimAmount = Number(claimAmount);

        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Insurance claim updated',
            data: invoice
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
