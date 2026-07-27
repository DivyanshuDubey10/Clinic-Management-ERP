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

const router = express.Router();

// Apply auth middleware to all patient routes
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST));

router.route('/')
    .post(createPatient)
    .get(getAllPatients);

router.route('/:id')
    .get(getPatientById)
    .put(updatePatient)
    .delete(deletePatient);

module.exports = router;
