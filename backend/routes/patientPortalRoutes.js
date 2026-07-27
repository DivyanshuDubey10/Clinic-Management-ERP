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
    verifyPortalPayment
} = require('../controllers/patientPortalController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// All portal routes require authentication
router.use(protect);

// Allow Patient, Admin, and Receptionist roles to access portal endpoints
router.use(authorize(ROLES.PATIENT, ROLES.ADMIN, ROLES.RECEPTIONIST));

// 7.1 Dashboard
router.get('/dashboard', getPatientDashboard);

// 7.2 Self-Service Appointments
router.route('/appointments')
    .post(bookAppointment)
    .get(getMyAppointments);

router.put('/appointments/:id/cancel', cancelMyAppointment);

// 7.3 Prescriptions & PDF Download
router.get('/prescriptions', getMyPrescriptions);
router.get('/prescriptions/:id/download', downloadPrescriptionPDF);

// 7.3 Lab Orders & PDF Download
router.get('/lab-orders', getMyLabOrders);
router.get('/lab-orders/:id/download', downloadLabOrderPDF);

// 7.4 Bill Payment & Invoices
router.get('/invoices', getMyInvoices);
router.get('/invoices/:id', getMyInvoiceById);
router.post('/invoices/:id/razorpay-order', createPortalRazorpayOrder);
router.post('/invoices/:id/verify-payment', verifyPortalPayment);

module.exports = router;
