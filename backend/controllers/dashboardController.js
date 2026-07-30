const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        // Count total patients
        const totalPatients = await Patient.countDocuments();

        // Count total appointments
        const totalAppointments = await Appointment.countDocuments();

        // Calculate today's start and end time
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Count today's appointments
        const todayAppointments = await Appointment.countDocuments({
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        // Count appointments by status
        const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
        const bookedAppointments = await Appointment.countDocuments({ status: 'Booked' });
        const cancelledAppointments = await Appointment.countDocuments({ status: 'Cancelled' });
        const noShowAppointments = await Appointment.countDocuments({ status: 'No-show' });

        // Fetch latest 5 appointments
        const recentAppointments = await Appointment.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({ path: 'patientId', model: 'Patient', select: 'firstName lastName patientId' })
            .populate({ path: 'doctorId', model: 'User', select: 'name specialization' });

        res.status(200).json({
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: {
                statistics: {
                    totalPatients,
                    totalAppointments,
                    todayAppointments,
                    completedAppointments,
                    bookedAppointments,
                    cancelledAppointments,
                    noShowAppointments
                },
                recentAppointments
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get doctor specific dashboard (Today's queue)
// @route   GET /api/dashboard/doctor
// @access  Private (Doctor)
const getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch today's appointments for this doctor
        const todayAppointments = await Appointment.find({
            doctorId,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })
        .populate({ path: 'patientId', model: 'Patient', select: 'firstName lastName patientId gender age phone email' })
        .sort({ appointmentDate: 1 });

        // Basic stats for the doctor today
        const totalToday = todayAppointments.length;
        const checkedIn = todayAppointments.filter(a => a.status === 'Checked-in').length;
        const completed = todayAppointments.filter(a => a.status === 'Completed').length;
        const waiting = todayAppointments.filter(a => ['Booked', 'Checked-in'].includes(a.status)).length;

        res.status(200).json({
            success: true,
            data: {
                queue: todayAppointments,
                stats: {
                    totalToday,
                    checkedIn,
                    completed,
                    waiting
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

module.exports = {
    getDashboardStats,
    getDoctorDashboard
};
