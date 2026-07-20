const express = require('express');
const {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply auth middleware to all patient routes
router.use(protect);

router.route('/')
    .post(createPatient)
    .get(getAllPatients);

router.route('/:id')
    .get(getPatientById)
    .put(updatePatient)
    .delete(deletePatient);

module.exports = router;
