const mongoose = require('mongoose');

const labOrderSchema = new mongoose.Schema({
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: [true, 'Consultation ID is required']
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient ID is required']
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Doctor ID is required']
    },
    tests: {
        type: [String],
        required: [true, 'At least one test must be ordered']
    },
    status: {
        type: String,
        enum: ['Pending', 'Sample Collected', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    results: [{
        documentUrl: { type: String }, // Optional URL to uploaded file
        parsedText: { type: String },  // OCR extracted text or manually entered results
        notes: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('LabOrder', labOrderSchema);
