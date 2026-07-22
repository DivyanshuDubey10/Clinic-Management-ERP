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
    payerType: {
        type: String,
        enum: ['Self', 'Family', 'Insurance', 'Other'],
        default: 'Self'
    },
    insurance: {
        provider: { type: String },
        policyNumber: { 
            type: String,
            required: function() { return this.payerType === 'Insurance'; }
        },
        groupNumber: { type: String },
        validTill: { 
            type: Date,
            required: function() { return this.payerType === 'Insurance'; }
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Automatically generate patientId before saving
patientSchema.pre('save', async function () {
    // Only generate a new ID if the document is new
    if (!this.isNew) {
        return;
    }

    const lastPatient = await this.constructor.findOne(
        {},
        {},
        { sort: { patientId: -1 } }
    );

    let newIdNumber = 1;

    if (lastPatient && lastPatient.patientId) {
        const lastNumber = parseInt(
            lastPatient.patientId.replace('PA', ''),
            10
        );

        if (!isNaN(lastNumber)) {
            newIdNumber = lastNumber + 1;
        }
    }

    this.patientId = `PA${String(newIdNumber).padStart(4, '0')}`;
});

module.exports = mongoose.model('Patient', patientSchema);
