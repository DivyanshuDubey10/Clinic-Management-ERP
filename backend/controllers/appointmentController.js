const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const DoctorAvailability = require('../models/DoctorAvailability');
const Waitlist = require('../models/Waitlist');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;

        // Validate patientId exists
        const patientExists = await Patient.findById(patientId);
        if (!patientExists) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Validate doctorId exists
        const doctorExists = await User.findById(doctorId);
        if (!doctorExists) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check for duplicate booking (prevent same patient or same doctor at the exact same time)
        const duplicateAppointment = await Appointment.findOne({
            $or: [
                { doctorId, appointmentDate, status: { $ne: 'cancelled' } },
                { patientId, appointmentDate, status: { $ne: 'cancelled' } }
            ]
        });

        if (duplicateAppointment) {
            return res.status(400).json({
                success: false,
                message: 'A duplicate appointment exists. The doctor or patient is already booked for this time.'
            });
        }

        // Add createdBy from auth middleware
        const appointmentData = {
            ...req.body,
            createdBy: req.user._id
        };

        const appointment = await Appointment.create(appointmentData);

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    try {
        const { startDate, endDate, doctorId } = req.query;
        let query = {};

        if (doctorId) query.doctorId = doctorId;
        
        if (startDate || endDate) {
            query.appointmentDate = {};
            if (startDate) query.appointmentDate.$gte = new Date(startDate);
            if (endDate) query.appointmentDate.$lte = new Date(endDate);
        }

        const appointments = await Appointment.find(query)
            .populate({ path: 'patientId', model: 'Patient', select: 'firstName lastName patientId' })
            .populate({ path: 'doctorId', model: 'User', select: 'name email specialization' })
            .populate({ path: 'createdBy', model: 'User', select: 'name email' })
            .sort({ appointmentDate: 1 });

        res.status(200).json({
            success: true,
            message: 'Appointments retrieved successfully',
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate({ path: 'patientId', model: 'Patient', select: 'firstName lastName patientId' })
            .populate({ path: 'doctorId', model: 'User', select: 'name email specialization' })
            .populate({ path: 'createdBy', model: 'User', select: 'name email' });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment retrieved successfully',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;

        // If updating patientId, validate it exists
        if (patientId) {
            const patientExists = await Patient.findById(patientId);
            if (!patientExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }
        }

        // If updating doctorId, validate it exists
        if (doctorId) {
            const doctorExists = await User.findById(doctorId);
            if (!doctorExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Doctor not found'
                });
            }
        }

        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check for duplicate booking if date, doctor, or patient is changing
        if (req.body.appointmentDate || req.body.doctorId || req.body.patientId) {
            const checkDoctorId = req.body.doctorId || appointment.doctorId;
            const checkPatientId = req.body.patientId || appointment.patientId;
            const checkDate = req.body.appointmentDate || appointment.appointmentDate;

            const duplicateAppointment = await Appointment.findOne({
                _id: { $ne: req.params.id }, // Exclude current appointment
                $or: [
                    { doctorId: checkDoctorId, appointmentDate: checkDate, status: { $ne: 'cancelled' } },
                    { patientId: checkPatientId, appointmentDate: checkDate, status: { $ne: 'cancelled' } }
                ]
            });

            if (duplicateAppointment) {
                return res.status(400).json({
                    success: false,
                    message: 'A duplicate appointment exists. The doctor or patient is already booked for this time.'
                });
            }
        }

        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate({ path: 'patientId', model: 'Patient', select: 'firstName lastName patientId' })
            .populate({ path: 'doctorId', model: 'User', select: 'name email specialization' })
            .populate({ path: 'createdBy', model: 'User', select: 'name email' });

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        await appointment.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get Available Slots
// @route   GET /api/appointments/available-slots
// @access  Private
const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.query;

        if (!doctorId || !date) {
            return res.status(400).json({ success: false, message: 'Please provide doctorId and date' });
        }

        const targetDate = new Date(date);
        const dayOfWeek = targetDate.getDay();

        const availability = await DoctorAvailability.findOne({ doctorId });
        
        if (!availability) {
            return res.status(404).json({ success: false, message: 'Doctor availability not set' });
        }

        // Check if doctor is on leave
        const isLeave = availability.leaveDates.some(leave => 
            leave.date.toDateString() === targetDate.toDateString()
        );

        if (isLeave) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Find working hours for this day
        const daySchedule = availability.workingHours.find(wh => wh.dayOfWeek === dayOfWeek);

        if (!daySchedule || daySchedule.isOffDay) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Generate slots
        const slots = [];
        const [startHour, startMin] = daySchedule.startTime.split(':').map(Number);
        const [endHour, endMin] = daySchedule.endTime.split(':').map(Number);
        
        let currentSlot = new Date(targetDate);
        currentSlot.setHours(startHour, startMin, 0, 0);
        
        const endSlot = new Date(targetDate);
        endSlot.setHours(endHour, endMin, 0, 0);

        const slotDurationMs = availability.slotDuration * 60000;

        while (currentSlot.getTime() + slotDurationMs <= endSlot.getTime()) {
            slots.push(new Date(currentSlot));
            currentSlot = new Date(currentSlot.getTime() + slotDurationMs);
        }

        // Fetch booked appointments
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const bookedAppointments = await Appointment.find({
            doctorId,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'Cancelled' }
        });

        // Filter out booked slots
        const availableSlots = slots.filter(slot => {
            return !bookedAppointments.some(appt => 
                appt.appointmentDate.getTime() === slot.getTime()
            );
        });

        res.status(200).json({
            success: true,
            data: availableSlots
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Trigger Appointment Reminders (For Cron/Admin)
// @route   POST /api/appointments/reminders
// @access  Private (Admin)
const triggerReminders = async (req, res) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const startOfTomorrow = new Date(tomorrow);
        startOfTomorrow.setHours(0, 0, 0, 0);
        
        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999);

        // Find appointments for tomorrow
        const upcomingAppointments = await Appointment.find({
            appointmentDate: { $gte: startOfTomorrow, $lte: endOfTomorrow },
            status: 'Booked'
        }).populate({ path: 'patientId', model: 'Patient', select: 'firstName email' });

        let emailsSent = 0;

        for (const appt of upcomingAppointments) {
            if (appt.patientId && appt.patientId.email) {
                const message = `Reminder: You have an appointment tomorrow at ${appt.appointmentDate.toLocaleTimeString()}.`;
                
                try {
                    await sendEmail({
                        email: appt.patientId.email,
                        subject: 'Appointment Reminder',
                        message
                    });
                    emailsSent++;
                } catch (err) {
                    console.error(`Could not send email to ${appt.patientId.email}`);
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Sent ${emailsSent} reminders`,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get Live Queue (Checked-in patients for today)
// @route   GET /api/appointments/queue/:doctorId
// @access  Private
const getLiveQueue = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const queue = await Appointment.find({
            doctorId,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['Checked-in', 'In-progress'] }
        })
            .populate({ path: 'patientId', model: 'Patient', select: 'firstName lastName patientId' })
            .sort({ appointmentDate: 1 });

        res.status(200).json({
            success: true,
            data: queue
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add to Waitlist
// @route   POST /api/appointments/waitlist
// @access  Private
const addToWaitlist = async (req, res) => {
    try {
        const waitlistEntry = await Waitlist.create(req.body);
        res.status(201).json({ success: true, data: waitlistEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Waitlist for Doctor/Date
// @route   GET /api/appointments/waitlist
// @access  Private
const getWaitlist = async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        let query = { status: 'Waiting' };
        
        if (doctorId) query.doctorId = doctorId;
        if (date) {
            const targetDate = new Date(date);
            const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
            query.requestedDate = { $gte: startOfDay, $lte: endOfDay };
        }

        const waitlist = await Waitlist.find(query)
            .populate({ path: 'patientId', model: 'Patient', select: 'firstName lastName phone' })
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: waitlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getAvailableSlots,
    triggerReminders,
    getLiveQueue,
    addToWaitlist,
    getWaitlist
};
