const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'Please provide a first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please provide a last name'],
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    dateOfBirth: {
        type: Date
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        unique: true
    },
    email: {
        type: String,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    allergies: {
        type: [String],
        default: []
    },
    medicalHistory: {
        type: [String],
        default: []
    },
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relation: { type: String }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Automatically generate patientId before saving
patientSchema.pre('save', async function (next) {
    // Only generate a new ID if the document is new
    if (!this.isNew) {
        return next();
    }

    try {
        // Find the patient with the highest patientId
        const lastPatient = await this.constructor.findOne({}, {}, { sort: { patientId: -1 } });

        let newIdNumber = 1;
        if (lastPatient && lastPatient.patientId) {
            // Extract the number part from PA0001
            const lastId = lastPatient.patientId;
            const lastNumber = parseInt(lastId.replace('PA', ''), 10);
            if (!isNaN(lastNumber)) {
                newIdNumber = lastNumber + 1;
            }
        }

        // Format the new ID, e.g., PA0001
        this.patientId = `PA${newIdNumber.toString().padStart(4, '0')}`;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Patient', patientSchema);
