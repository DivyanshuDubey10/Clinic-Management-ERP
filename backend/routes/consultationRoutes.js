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
    getConsultations,
    getConsultationById,
    getConsultationByAppointment,
    addPrescription,
    createLabOrder,
    uploadLabResults,
    downloadPrescriptionPDF
} = require('../controllers/consultationController');

const { validateObjectId, validateBody, validateArray } = require('../middlewares/validationMiddleware');

// All consultation routes require authentication
router.use(protect);

// Get all consultations
router.get('/', authorize(ROLES.DOCTOR, ROLES.ADMIN, ROLES.RECEPTIONIST), getConsultations);

// Create a new consultation note (SOAP)
router.post('/', authorize(ROLES.DOCTOR, ROLES.ADMIN), validateBody('appointmentId', 'symptoms', 'diagnosis', 'treatmentPlan'), validateObjectId('appointmentId'), createConsultation);

// Get consultations by patient ID specifically
router.get('/patient/:patientId', authorize(ROLES.DOCTOR, ROLES.ADMIN, ROLES.RECEPTIONIST), getConsultations);

// Get complete consultation details by ID
router.get('/:id', validateObjectId('id'), getConsultationById);

// Get complete consultation details by appointment ID
router.get('/appointment/:appointmentId', validateObjectId('appointmentId'), getConsultationByAppointment); // Patients can also view their own (handled in frontend logic for now)

// Add a prescription to a consultation
router.post('/:id/prescription', authorize(ROLES.DOCTOR), validateObjectId('id'), validateArray('medications'), addPrescription);

// Download Prescription PDF
router.get('/:id/prescription/download', authorize(ROLES.DOCTOR, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT), validateObjectId('id'), downloadPrescriptionPDF);

// Order lab tests
router.post('/:id/lab-orders', authorize(ROLES.DOCTOR), validateObjectId('id'), validateArray('tests'), createLabOrder);

// Upload/Attach Lab Results to an Order (Now accepts multipart form data with file)
router.put('/lab-orders/:orderId/results', authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST), validateObjectId('orderId'), upload.single('file'), uploadLabResults);

module.exports = router;
