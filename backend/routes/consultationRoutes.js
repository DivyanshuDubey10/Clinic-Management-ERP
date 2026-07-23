const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const multer = require('multer');

// Configure multer to store files in memory for processing
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
    createConsultation,
    getConsultationByAppointment,
    addPrescription,
    createLabOrder,
    uploadLabResults,
    downloadPrescriptionPDF
} = require('../controllers/consultationController');

// All consultation routes require authentication
router.use(protect);

// Create a new consultation note (SOAP)
router.post('/', authorize(ROLES.DOCTOR, ROLES.ADMIN), createConsultation);

// Get complete consultation details
router.get('/:appointmentId', getConsultationByAppointment); // Patients can also view their own (handled in frontend logic for now)

// Add a prescription to a consultation
router.post('/:id/prescription', authorize(ROLES.DOCTOR), addPrescription);

// Download Prescription PDF
router.get('/:id/prescription/download', authorize(ROLES.DOCTOR, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), downloadPrescriptionPDF);

// Order lab tests
router.post('/:id/lab-orders', authorize(ROLES.DOCTOR), createLabOrder);

// Upload/Attach Lab Results to an Order (Now accepts multipart form data with file)
router.put('/lab-orders/:orderId/results', authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST), upload.single('file'), uploadLabResults);

module.exports = router;
