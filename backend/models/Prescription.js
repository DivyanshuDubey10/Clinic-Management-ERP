const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
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
    medications: [{
        drugName: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g. "500mg"
        frequency: { type: String, required: true }, // e.g. "1-0-1" or "Twice daily"
        duration: { type: String, required: true }, // e.g. "5 days"
        instructions: {
            type: String
        }
    }],
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Dispensed'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
