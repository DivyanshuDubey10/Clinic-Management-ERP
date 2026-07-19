const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
        const { name, email, phone, password, role } = req.body;

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
            role // The model defaults to 'Patient' if not provided
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
