const express = require('express');
const {
    getPatientDashboard,
    bookAppointment,
    getMyAppointments,
    cancelMyAppointment,
    getMyPrescriptions,
    downloadPrescriptionPDF,
    getMyLabOrders,
    downloadLabOrderPDF,
    getMyInvoices,
    getMyInvoiceById,
    createPortalRazorpayOrder,
    verifyPortalPayment,
    getPortalDoctors
} = require('../controllers/patientPortalController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const { validateObjectId, validateBody, validateQuery, validatePaymentSignature } = require('../middlewares/validationMiddleware');

const router = express.Router();

// All portal routes require authentication
router.use(protect);

// Allow Patient, Admin, and Receptionist roles to access portal endpoints
router.use(authorize(ROLES.PATIENT, ROLES.ADMIN, ROLES.RECEPTIONIST));

// 7.1 Dashboard
router.get('/dashboard', getPatientDashboard);

// 7.5 Get Doctors for booking
router.get('/doctors', getPortalDoctors);

// 7.2 Self-Service Appointments
router.route('/appointments')
    .post(validateBody('doctorId', 'appointmentDate', 'reasonForVisit'), validateObjectId('doctorId'), bookAppointment)
    .get(getMyAppointments);

router.get('/appointments/available-slots', validateQuery('doctorId', 'date'), validateObjectId('doctorId'), require('../controllers/appointmentController').getAvailableSlots);

router.put('/appointments/:id/cancel', validateObjectId('id'), cancelMyAppointment);

// 7.3 Prescriptions & PDF Download
router.get('/prescriptions', getMyPrescriptions);
router.get('/prescriptions/:id/download', validateObjectId('id'), downloadPrescriptionPDF);

// 7.3 Lab Orders & PDF Download
router.get('/lab-orders', getMyLabOrders);
router.get('/lab-orders/:id/download', validateObjectId('id'), downloadLabOrderPDF);

// 7.4 Bill Payment & Invoices
router.get('/invoices', getMyInvoices);
router.get('/invoices/:id', validateObjectId('id'), getMyInvoiceById);
router.post('/invoices/:id/razorpay-order', validateObjectId('id'), createPortalRazorpayOrder);
router.post('/invoices/:id/verify-payment', validateObjectId('id'), validatePaymentSignature, verifyPortalPayment);

module.exports = router;
