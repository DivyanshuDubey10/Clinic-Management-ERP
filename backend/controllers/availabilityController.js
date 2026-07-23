const DoctorAvailability = require('../models/DoctorAvailability');
const User = require('../models/User');

// @desc    Set or Update Doctor Availability
// @route   POST /api/availability
// @access  Private (Admin, Doctor)
const setAvailability = async (req, res) => {
    try {
        const { doctorId, workingHours, slotDuration, leaveDates } = req.body;
        
        // Ensure user is authorized to set this (Admin or the doctor themselves)
        if (req.user.role !== 'Admin' && req.user._id.toString() !== doctorId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to set availability for this doctor'
            });
        }

        // Verify doctor exists
        const doctorExists = await User.findById(doctorId);
        if (!doctorExists || doctorExists.role !== 'Doctor') {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        let availability = await DoctorAvailability.findOne({ doctorId });

        if (availability) {
            // Update existing
            availability.workingHours = workingHours || availability.workingHours;
            availability.slotDuration = slotDuration || availability.slotDuration;
            availability.leaveDates = leaveDates || availability.leaveDates;
            await availability.save();
        } else {
            // Create new
            availability = await DoctorAvailability.create({
                doctorId,
                workingHours,
                slotDuration,
                leaveDates
            });
        }

        res.status(200).json({
            success: true,
            message: 'Availability updated successfully',
            data: availability
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get Doctor Availability
// @route   GET /api/availability/:doctorId
// @access  Private
const getAvailability = async (req, res) => {
    try {
        const availability = await DoctorAvailability.findOne({ doctorId: req.params.doctorId })
            .populate({ path: 'doctorId', model: 'User', select: 'name email specialization' });

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: 'Availability not found for this doctor'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Availability retrieved successfully',
            data: availability
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

module.exports = {
    setAvailability,
    getAvailability
};
