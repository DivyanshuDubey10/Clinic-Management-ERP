const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { ROLES } = require('../constants/roles');

// Helper function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, role, specialization } = req.body;

        // 1. Validate required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // 2. Check if user already exists by email
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // 3. Check if user already exists by phone
        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
            return res.status(400).json({ success: false, message: 'Phone number already exists' });
        }

        // 4. Create new user
        // The password will automatically be hashed by the Mongoose pre-save hook in the User model
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role, // The model defaults to 'Patient' if not provided
            specialization
        });

        // 5. Generate a JWT token
        const token = generateToken(user._id);

        // Remove password from the response object
        user.password = undefined;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // 2. Check for user and explicitly select the password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        // 4. Prevent inactive users from logging in
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact the administrator.'
            });
        }

        // 4. Generate JWT token
        const token = generateToken(user._id);

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        // req.user is attached by the authMiddleware.protect middleware
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        
        // Only allow updating specialization and consultation hours if user is a Doctor
        if (user.role === ROLES.DOCTOR) {
            user.specialization = req.body.specialization || user.specialization;
            user.consultationHours = req.body.consultationHours || user.consultationHours;
        }

        // If user wants to update password
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        updatedUser.password = undefined; // Do not return password

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email address' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP and expire time (10 minutes)
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;
        
        await user.save({ validateBeforeSave: false });

        // Send email
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the following OTP to reset your password:\n\n${otp}\n\nThis OTP is valid for 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message
            });

            res.status(200).json({ success: true, message: 'OTP sent to email' });
        } catch (err) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;
            await user.save({ validateBeforeSave: false });

            console.error('Email sending failed:', err);
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Verify reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
exports.verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
        }

        const user = await User.findOne({ 
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password' });
        }

        // Verify OTP again for security
        const user = await User.findOne({ 
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
