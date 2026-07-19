const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide the associated User ID']
        },
        qualification: {
            type: String,
            required: [true, 'Please provide the doctor\'s qualification (e.g., MBBS, MD)'],
            trim: true
        },
        experience: {
            type: Number,
            required: [true, 'Please provide the years of experience'],
            min: [0, 'Experience cannot be negative']
        },
        department: {
            type: String,
            required: [true, 'Please provide the department (e.g., Cardiology, Neurology)'],
            trim: true
        },
        consultationFee: {
            type: Number,
            required: [true, 'Please provide the consultation fee'],
            min: [0, 'Consultation fee cannot be negative']
        },
        workingDays: {
            type: [String],
            required: [true, 'Please specify the working days'],
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        workingHours: {
            startTime: {
                type: String,
                required: [true, 'Please specify the start time (e.g., 09:00)'],
                match: [/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Please provide a valid time format (HH:MM)']
            },
            endTime: {
                type: String,
                required: [true, 'Please specify the end time (e.g., 17:00)'],
                match: [/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Please provide a valid time format (HH:MM)']
            }
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Doctor', doctorSchema);
