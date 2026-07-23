const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Appointment ID is required'],
        unique: true // One consultation per appointment
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Patient ID is required']
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Doctor ID is required']
    },
    // SOAP Format
    symptoms: {
        type: String, // Subjective
        default: ''
    },
    examinationFindings: {
        type: String, // Objective
        default: ''
    },
    diagnosis: {
        type: String, // Assessment
        default: ''
    },
    treatmentPlan: {
        type: String, // Plan
        default: ''
    },
    followUpDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Draft', 'Completed'],
        default: 'Draft'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Consultation', consultationSchema);
