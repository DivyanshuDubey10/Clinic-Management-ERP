const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

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
        const appointments = await Appointment.find()
            .populate('patientId', 'firstName lastName patientId')
            .populate('doctorId', 'name email specialization')
            .populate('createdBy', 'name email')
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
            .populate('patientId', 'firstName lastName patientId')
            .populate('doctorId', 'name email specialization')
            .populate('createdBy', 'name email');

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
            .populate('patientId', 'firstName lastName patientId')
            .populate('doctorId', 'name email specialization')
            .populate('createdBy', 'name email');

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

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
};
