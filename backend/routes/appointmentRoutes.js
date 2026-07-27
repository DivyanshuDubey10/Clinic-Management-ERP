const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const {
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
} = require('../controllers/appointmentController');

const { validateObjectId, validateBody, validateQuery } = require('../middlewares/validationMiddleware');

// Apply protection to all routes
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST));

router.route('/')
    .post(validateBody('patientId', 'doctorId', 'appointmentDate', 'reasonForVisit'), validateObjectId('patientId', 'doctorId'), createAppointment)
    .get(getAppointments);

router.post('/reminders', authorize(ROLES.ADMIN), triggerReminders);
router.get('/available-slots', validateQuery('doctorId', 'date'), validateObjectId('doctorId'), getAvailableSlots);

router.get('/queue/:doctorId', validateObjectId('doctorId'), getLiveQueue);

router.route('/waitlist')
    .post(validateBody('patientId', 'doctorId', 'requestedDate'), validateObjectId('patientId', 'doctorId'), addToWaitlist)
    .get(getWaitlist);

router.route('/:id')
    .get(validateObjectId('id'), getAppointmentById)
    .put(validateObjectId('id'), updateAppointment)
    .delete(validateObjectId('id'), deleteAppointment);

module.exports = router;
