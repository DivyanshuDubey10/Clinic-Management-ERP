const mongoose = require('mongoose');

const workingHourSchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        required: true,
        min: 0,
        max: 6
    },
    dayName: {
        type: String, // 'Monday', 'Tuesday', etc.
        required: true
    },
    startTime: {
        type: String, // '09:00'
        default: '09:00'
    },
    endTime: {
        type: String, // '17:00'
        default: '17:00'
    },
    isClosed: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const clinicSettingSchema = new mongoose.Schema({
    clinicName: {
        type: String,
        required: [true, 'Clinic name is required'],
        default: 'Healthcare Excellence Clinic'
    },
    branchName: {
        type: String,
        required: [true, 'Branch name is required'],
        default: 'Main Branch'
    },
    branchCode: {
        type: String,
        unique: true,
        required: [true, 'Branch code is required'],
        uppercase: true,
        trim: true
    },
    isPrimary: {
        type: Boolean,
        default: false
    },
    contactInfo: {
        address: { type: String, default: '123 Health Avenue, Medical District' },
        city: { type: String, default: 'New Delhi' },
        state: { type: String, default: 'Delhi' },
        pincode: { type: String, default: '110001' },
        phone: {
            type: String,
            default: '1123456789',
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
        },
        email: { type: String, default: 'contact@clinicerp.com' },
        website: { type: String, default: 'https://www.clinicerp.com' }
    },
    taxAndGstSettings: {
        gstNumber: { type: String, default: '07AAAAA0000A1Z5' },
        defaultTaxPercentage: { type: Number, default: 5, min: 0, max: 100 }, // e.g. 5% GST
        currency: { type: String, default: 'INR' },
        currencySymbol: { type: String, default: '₹' }
    },
    operationalSettings: {
        defaultSlotDurationMinutes: { type: Number, default: 15, enum: [10, 15, 20, 30, 45, 60] },
        maxAdvanceBookingDays: { type: Number, default: 30 },
        cancellationPolicyHours: { type: Number, default: 4 }, // Free cancellation up to X hours before
        enableOnlinePayment: { type: Boolean, default: true },
        enableSMSNotifications: { type: Boolean, default: false },
        enableEmailNotifications: { type: Boolean, default: true }
    },
    workingHours: {
        type: [workingHourSchema],
        default: [
            { dayOfWeek: 1, dayName: 'Monday', startTime: '09:00', endTime: '18:00', isClosed: false },
            { dayOfWeek: 2, dayName: 'Tuesday', startTime: '09:00', endTime: '18:00', isClosed: false },
            { dayOfWeek: 3, dayName: 'Wednesday', startTime: '09:00', endTime: '18:00', isClosed: false },
            { dayOfWeek: 4, dayName: 'Thursday', startTime: '09:00', endTime: '18:00', isClosed: false },
            { dayOfWeek: 5, dayName: 'Friday', startTime: '09:00', endTime: '18:00', isClosed: false },
            { dayOfWeek: 6, dayName: 'Saturday', startTime: '09:00', endTime: '14:00', isClosed: false },
            { dayOfWeek: 0, dayName: 'Sunday', startTime: '00:00', endTime: '00:00', isClosed: true }
        ]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ClinicSetting', clinicSettingSchema);
