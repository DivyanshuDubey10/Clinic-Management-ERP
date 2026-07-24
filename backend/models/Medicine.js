const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchNumber: {
        type: String,
        required: [true, 'Batch number is required']
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    purchasePrice: {
        type: Number,
        required: true
    }
}, { _id: true }); // keep _id so we can reference specific batches easily

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Medicine brand name is required'],
        trim: true
    },
    genericName: {
        type: String,
        required: [true, 'Generic name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Other'],
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: [true, 'Selling price per unit is required']
    },
    reorderThreshold: {
        type: Number,
        default: 50 // Warn when total stock falls below this
    },
    batches: [batchSchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for calculating total available stock
medicineSchema.virtual('totalStock').get(function() {
    if (!this.batches) return 0;
    
    // Sum up quantities of all non-expired batches
    const now = new Date();
    return this.batches.reduce((total, batch) => {
        if (batch.expiryDate > now) {
            return total + batch.quantity;
        }
        return total;
    }, 0);
});

module.exports = mongoose.model('Medicine', medicineSchema);
