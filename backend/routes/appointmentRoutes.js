const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

// Apply protection to all routes
router.use(protect);

router.route('/')
    .post(createAppointment)
    .get(getAppointments);

router.route('/:id')
    .get(getAppointmentById)
    .put(updateAppointment)
    .delete(deleteAppointment);

module.exports = router;
