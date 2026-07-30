const mongoose = require('mongoose');

const labOrderSchema = new mongoose.Schema({
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Consultation ID is required']
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Patient ID is required']
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Doctor ID is required']
    },
    tests: {
        type: [String],
        required: [true, 'At least one test must be ordered']
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    results: [{
        documentUrl: { type: String, required: true }, // Simple URL link to AWS/Cloudinary or local /uploads
        parsedText: { type: String }, // OCR extracted text
        notes: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('LabOrder', labOrderSchema);
