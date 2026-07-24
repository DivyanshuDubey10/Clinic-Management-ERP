const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Item description is required']
    },
    type: {
        type: String,
        enum: ['Consultation', 'Procedure', 'Pharmacy', 'Other'],
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: ['Cash', 'Card', 'UPI', 'Online'],
        required: true
    },
    transactionId: {
        type: String // Optional, for online/card/UPI payments
    },
    receiptNumber: {
        type: String // Auto-generated or from external system
    }
});

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient ID is required']
    },
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation' // Optional, if invoice is linked directly to a consultation
    },
    items: [invoiceItemSchema],
    billingDetails: {
        subTotal: { type: Number, default: 0 },
        tax: { type: Number, default: 0 }, // E.g., calculated tax amount
        discount: { type: Number, default: 0 },
        grandTotal: { type: Number, default: 0 },
        amountPaid: { type: Number, default: 0 },
        amountDue: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['Pending', 'Partial', 'Paid', 'Cancelled'],
        default: 'Pending'
    },
    paymentHistory: [paymentSchema],
    insuranceDetails: {
        provider: { type: String },
        policyNumber: { type: String },
        claimStatus: { 
            type: String, 
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        claimAmount: { type: Number, default: 0 }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    razorpayOrderId: {
        type: String // To track online payment orders
    }
}, {
    timestamps: true
});

// Auto-generate invoiceNumber before save
invoiceSchema.pre('save', async function (next) {
    if (!this.isNew) {
        return next();
    }

    const lastInvoice = await this.constructor.findOne(
        {},
        {},
        { sort: { invoiceNumber: -1 } }
    );

    let newIdNumber = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
        const lastNumber = parseInt(
            lastInvoice.invoiceNumber.replace('INV-', ''),
            10
        );
        if (!isNaN(lastNumber)) {
            newIdNumber = lastNumber + 1;
        }
    }
    this.invoiceNumber = `INV-${String(newIdNumber).padStart(5, '0')}`;
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
