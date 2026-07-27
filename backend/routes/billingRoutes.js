const express = require('express');
const {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    createRazorpayOrder,
    verifyOnlinePayment,
    recordManualPayment,
    updateInsuranceClaim
} = require('../controllers/billingController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const { validateObjectId, validateBody, validateArray, validatePaymentSignature } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Require authentication for all billing routes
router.use(protect);

// Routes
router.route('/invoices')
    .post(authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), validateBody('patientId', 'items'), validateArray('items'), validateObjectId('patientId'), createInvoice)
    .get(authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), getAllInvoices);

router.route('/invoices/:id')
    .get(authorize(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), validateObjectId('id'), getInvoiceById);

// Payment routes
router.post('/invoices/:id/razorpay-order', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), validateObjectId('id'), createRazorpayOrder);
router.post('/invoices/:id/verify-payment', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), validateObjectId('id'), validatePaymentSignature, verifyOnlinePayment);
router.post('/invoices/:id/manual-payment', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), validateObjectId('id'), validateBody('amount', 'method'), recordManualPayment);

// Insurance route
router.put('/invoices/:id/insurance', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), validateObjectId('id'), updateInsuranceClaim);

module.exports = router;
