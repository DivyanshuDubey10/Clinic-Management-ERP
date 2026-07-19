const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        phone: {
            type: String,
            required: [true, 'Please provide a phone number'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false 
        },
        role: {
            type: String,
            enum: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Patient'],
            default: 'Patient'
        },
        specialization: {
            type: String,
            required: function() {
                return this.role === 'Doctor';
            }
        },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clinic'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Mongoose Pre-Save Hook: Encrypt password using bcrypt before saving to DB
userSchema.pre('save', async function (next) {
    // If the password is not modified, skip hashing (useful when updating other fields)
    if (!this.isModified('password')) {
        next();
    }

    // Generate a salt (10 rounds is a good balance between security and speed)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance Method: Check if entered password matches the hashed password in the DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
