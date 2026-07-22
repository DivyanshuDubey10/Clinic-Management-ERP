const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

// Apply protection to all routes
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST));

router.route('/')
    .post(createAppointment)
    .get(getAppointments);

router.route('/:id')
    .get(getAppointmentById)
    .put(updateAppointment)
    .delete(deleteAppointment);

module.exports = router;
