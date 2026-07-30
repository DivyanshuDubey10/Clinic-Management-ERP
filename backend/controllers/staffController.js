const User = require('../models/User');
const { ROLES, STAFF_ROLES } = require('../constants/roles');

// @desc    Create new staff
// @route   POST /api/staff
// @access  Private/Admin
exports.createStaff = async (req, res) => {
    try {
        const { name, email, phone, password, role, department, specialization } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Validate role (don't allow creating a patient through this endpoint)
        if (!STAFF_ROLES.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid staff role provided' });
        }

        // Check if email or phone already exists
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
        }

        const staff = await User.create({
            name,
            email,
            phone,
            password,
            role,
            department,
            specialization
        });

        staff.password = undefined; // Hide password in response

        res.status(201).json({
            success: true,
            message: 'Staff member created successfully',
            data: staff
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get all staff (with filtering and pagination)
// @route   GET /api/staff
// @access  Private/Admin
exports.getAllStaff = async (req, res) => {
    try {
        const { role, department, search, page = 1, limit = 10 } = req.query;

        // Base query: Get all users EXCEPT patients
        let query = { role: { $ne: ROLES.PATIENT } };

        // Apply filters
        if (role) query.role = role;
        if (department) query.department = department;

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination setup
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const total = await User.countDocuments(query);

        const staff = await User.find(query)
            .select('-password -resetPasswordOTP -resetPasswordOTPExpire')
            .skip(startIndex)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: staff.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            data: staff
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get single staff member by ID
// @route   GET /api/staff/:id
// @access  Private/Admin
exports.getStaffById = async (req, res) => {
    try {
        const staff = await User.findOne({ _id: req.params.id, role: { $ne: ROLES.PATIENT } })
            .select('-password -resetPasswordOTP -resetPasswordOTPExpire');

        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }

        res.status(200).json({
            success: true,
            data: staff
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
exports.updateStaff = async (req, res) => {
    try {
        let staff = await User.findOne({ _id: req.params.id, role: { $ne: ROLES.PATIENT } });

        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }

        const { name, email, phone, role, department, specialization, password, isActive } = req.body;

        // If email or phone is updated, ensure they are unique
        if (email && email !== staff.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        if (phone && phone !== staff.phone) {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) return res.status(400).json({ success: false, message: 'Phone number already in use' });
        }

        // Update fields
        if (name) staff.name = name;
        if (email) staff.email = email;
        if (phone) staff.phone = phone;
        if (role) staff.role = role;
        if (department) staff.department = department;
        if (specialization) staff.specialization = specialization;
        if (isActive !== undefined) staff.isActive = isActive;
        if (password) staff.password = password; // Pre-save hook will hash it

        await staff.save();

        staff.password = undefined; // Don't return password

        res.status(200).json({
            success: true,
            message: 'Staff updated successfully',
            data: staff
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Delete staff member (Soft Delete)
// @route   DELETE /api/staff/:id
// @access  Private/Admin
exports.deleteStaff = async (req, res) => {
    try {
        const staff = await User.findOne({ _id: req.params.id, role: { $ne: ROLES.PATIENT } });

        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }

        // Soft delete
        staff.isActive = false;
        await staff.save({ validateBeforeSave: false }); // Skip validation just in case

        res.status(200).json({
            success: true,
            message: 'Staff member deleted (deactivated) successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
