const DoctorAvailability = require('../models/DoctorAvailability');
const User = require('../models/User');

// @desc    Set or Update Doctor Availability
// @route   POST /api/availability
// @access  Private (Admin, Doctor)
const setAvailability = async (req, res) => {
    try {
        let { doctorId, workingHours, slotDuration, leaveDates, startTime, endTime, lunchStart, lunchEnd, workingDays, leaves } = req.body;
        
        // Map frontend payload if provided
        if (workingDays && Array.isArray(workingDays) && startTime && endTime) {
            workingHours = [];
            for (let i = 0; i < 7; i++) {
                workingHours.push({
                    dayOfWeek: i,
                    startTime: startTime,
                    endTime: endTime,
                    lunchStart: lunchStart,
                    lunchEnd: lunchEnd,
                    isOffDay: !workingDays.includes(i)
                });
            }
        }

        if (leaves && Array.isArray(leaves)) {
            leaveDates = leaves.map(date => ({ date: new Date(date), reason: 'Leave' }));
        }
        
        // Fallback to logged-in user if doctorId not provided
        if (!doctorId && req.user && req.user.role?.toLowerCase() === 'doctor') {
            doctorId = req.user._id.toString();
        }

        // Ensure user is authorized to set this (Admin or the doctor themselves)
        if (req.user.role?.toLowerCase() !== 'admin' && req.user._id.toString() !== doctorId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to set availability for this doctor'
            });
        }

        // Verify doctor exists
        const doctorExists = await User.findById(doctorId);
        if (!doctorExists || doctorExists.role?.toLowerCase() !== 'doctor') {
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

const getAllAvailability = async (req, res) => {
    try {
        const data = await DoctorAvailability.find().populate("doctorId", "name specialization");
        res.status(200).json({
            success: true,
            data
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
    getAvailability,
    getAllAvailability
};
