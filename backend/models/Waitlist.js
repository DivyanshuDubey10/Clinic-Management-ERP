const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Patient ID is required']
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Doctor ID is required']
    },
    requestedDate: {
        type: Date,
        required: [true, 'Requested date is required']
    },
    status: {
        type: String,
        enum: ['Waiting', 'Assigned', 'Cancelled'],
        default: 'Waiting'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Waitlist', waitlistSchema);
