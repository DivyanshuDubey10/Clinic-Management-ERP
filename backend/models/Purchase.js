const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
    medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    batchNumber: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    }
});

const purchaseSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        required: [true, 'Supplier name is required']
    },
    invoiceNumber: {
        type: String,
        required: [true, 'Invoice number is required']
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    items: [purchaseItemSchema],
    totalAmount: {
        type: Number,
        default: 0
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Purchase', purchaseSchema);
