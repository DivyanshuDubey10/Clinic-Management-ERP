const express = require('express');
const {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const { validateObjectId, validateBody } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Apply auth middleware to all patient routes
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST));

router.route('/')
    .post(validateBody('firstName', 'lastName', 'phone'), createPatient)
    .get(getAllPatients);

router.route('/:id')
    .get(validateObjectId('id'), getPatientById)
    .put(validateObjectId('id'), updatePatient)
    .delete(validateObjectId('id'), deletePatient);

module.exports = router;
