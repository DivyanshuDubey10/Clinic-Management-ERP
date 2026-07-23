const mongoose = require('mongoose');

const doctorAvailabilitySchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Doctor ID is required'],
        unique: true
    },
    workingHours: [{
        dayOfWeek: { 
            type: Number, 
            min: 0, 
            max: 6, // 0 = Sunday, 1 = Monday, etc.
            required: true 
        },
        startTime: { 
            type: String, // "09:00"
            required: true 
        },
        endTime: { 
            type: String, // "17:00"
            required: true 
        },
        isOffDay: {
            type: Boolean,
            default: false
        }
    }],
    slotDuration: {
        type: Number,
        default: 15, // Slot duration in minutes
        enum: [10, 15, 20, 30, 45, 60]
    },
    leaveDates: [{
        date: { type: Date, required: true },
        reason: { type: String }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
