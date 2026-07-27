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

const router = express.Router();

// Require authentication for all billing routes
router.use(protect);

// Routes
router.route('/invoices')
    .post(authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), createInvoice)
    .get(authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), getAllInvoices);

router.route('/invoices/:id')
    .get(authorize(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), getInvoiceById);

// Payment routes
router.post('/invoices/:id/razorpay-order', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), createRazorpayOrder);
router.post('/invoices/:id/verify-payment', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), verifyOnlinePayment);
router.post('/invoices/:id/manual-payment', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), recordManualPayment);

// Insurance route
router.put('/invoices/:id/insurance', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), updateInsuranceClaim);

module.exports = router;
