const User = require('../models/User');
const { ROLES, STAFF_ROLES } = require('../constants/roles');
const Notification = require('../models/Notification');

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

        if (role === ROLES.ADMIN) {
            const adminExists = await User.findOne({ role: ROLES.ADMIN });
            if (adminExists) {
                return res.status(400).json({ success: false, message: 'An admin already exists. Only one admin is allowed.' });
            }
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

        if (req.user) {
            await Notification.create({
                user: req.user._id,
                title: 'Staff Created',
                message: `New staff member ${staff.name} has been added.`,
                type: 'success',
                link: `/staff/${staff._id}`
            });
        }

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

        // Show active staff only. Deleted staff are soft-deleted by setting isActive to false.
        let query = { role: { $ne: ROLES.PATIENT }, isActive: true };

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

        const { name, phone, role, department, specialization, password, isActive } = req.body;

        if (role === ROLES.ADMIN && staff.role !== ROLES.ADMIN) {
            const adminExists = await User.findOne({ role: ROLES.ADMIN });
            if (adminExists) {
                return res.status(400).json({ success: false, message: 'An admin already exists. Only one admin is allowed.' });
            }
        }

        // Email addresses are permanent account identifiers, including when an admin manages staff.
        if (Object.prototype.hasOwnProperty.call(req.body, 'email') && req.body.email !== staff.email) {
            return res.status(400).json({ success: false, message: 'Email address cannot be changed' });
        }
        if (phone && phone !== staff.phone) {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) return res.status(400).json({ success: false, message: 'Phone number already in use' });
        }

        // Update fields
        if (name) staff.name = name;
        if (phone) staff.phone = phone;
        if (role) staff.role = role;
        if (department) staff.department = department;
        if (specialization) staff.specialization = specialization;
        if (isActive !== undefined) staff.isActive = isActive;
        if (password) staff.password = password; // Pre-save hook will hash it

        await staff.save();

        staff.password = undefined; // Don't return password

        if (req.user) {
            await Notification.create({
                user: req.user._id,
                title: 'Staff Updated',
                message: `Staff member ${staff.name} details have been updated.`,
                type: 'info',
                link: `/staff/${staff._id}`
            });
        }

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

        if (req.user) {
            await Notification.create({
                user: req.user._id,
                title: 'Staff Deleted',
                message: `Staff member has been deactivated.`,
                type: 'warning'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Staff member deleted (deactivated) successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
