const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const {
    getPrescriptions,
    getPrescriptionById
} = require('../controllers/prescriptionController');
const { validateObjectId } = require('../middlewares/validationMiddleware');

// All prescription routes require authentication
router.use(protect);

// Get all prescriptions
router.get('/', authorize(ROLES.DOCTOR, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), getPrescriptions);

// Get complete prescription details by ID
router.get('/:id', validateObjectId('id'), authorize(ROLES.DOCTOR, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), getPrescriptionById);

module.exports = router;
