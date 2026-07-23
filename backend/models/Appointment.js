const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentNumber: {
        type: String,
        unique: true
    },
    patientId: {
        type: String,
        required: [true, 'Please provide a patient ID']
    },
    doctorId: {
        type: String,
        required: [true, 'Please provide a doctor ID']
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Please provide an appointment date']
    },
    duration: {
        type: Number,
        required: [true, 'Please provide appointment duration in minutes']
    },
    appointmentType: {
        type: String,
        enum: ['Walk-in', 'Online', 'Follow-up'],
        required: [true, 'Please specify appointment type']
    },
    status: {
        type: String,
        enum: ['booked', 'checked-in', 'in-progress', 'completed', 'cancelled', 'no-show'],
        default: 'booked'
    },
    reasonForVisit: {
        type: String,
        required: [true, 'Please provide a reason for the visit']
    },
    consultationRoom: {
        type: String
    },
    createdBy: {
        type: String
    }
}, {
    timestamps: true
});

// Automatically generate appointmentNumber before saving
appointmentSchema.pre('save', async function () {
    if (!this.isNew) {
        return;
    }

    const lastAppointment = await this.constructor.findOne(
        {},
        {},
        { sort: { appointmentNumber: -1 } }
    );

    let newIdNumber = 1;

    if (lastAppointment && lastAppointment.appointmentNumber) {
        const lastNumber = parseInt(
            lastAppointment.appointmentNumber.replace('A', ''),
            10
        );

        if (!isNaN(lastNumber)) {
            newIdNumber = lastNumber + 1;
        }
    }

    this.appointmentNumber = `A${String(newIdNumber).padStart(4, '0')}`;
});

module.exports = mongoose.model('Appointment', appointmentSchema);
