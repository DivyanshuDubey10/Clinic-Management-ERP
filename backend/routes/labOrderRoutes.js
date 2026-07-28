const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const {
    getLabOrders,
    getLabOrderById
} = require('../controllers/labOrderController');
const { validateObjectId } = require('../middlewares/validationMiddleware');

// All lab order routes require authentication
router.use(protect);

// Get all lab orders
router.get('/', authorize(ROLES.DOCTOR, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), getLabOrders);

// Get complete lab order details by ID
router.get('/:id', validateObjectId('id'), authorize(ROLES.DOCTOR, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), getLabOrderById);

module.exports = router;
