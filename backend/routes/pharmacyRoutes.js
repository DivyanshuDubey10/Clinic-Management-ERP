const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const {
    addMedicine,
    getMedicines,
    recordPurchase,
    dispensePrescription,
    getAlerts,
    getPurchases,
    getPurchaseById,
    getPendingPrescriptions,
    getPrescriptionById
} = require('../controllers/pharmacyController');
const { validateObjectId, validateBody, validateArray } = require('../middlewares/validationMiddleware');

// All pharmacy routes require authentication
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.RECEPTIONIST));

// Item Master
router.route('/medicines')
    .post(validateBody('name', 'genericName', 'category', 'manufacturer', 'unitPrice'), addMedicine)
    .get(getMedicines);

// Stock In / Purchases
router.route('/purchases')
    .post(validateBody('supplierName', 'invoiceNumber', 'items'), validateArray('items'), recordPurchase)
    .get(getPurchases);
router.get('/purchases/:id', validateObjectId('id'), getPurchaseById);

// Prescriptions for Dispensing
router.get('/prescriptions/pending', getPendingPrescriptions);
router.get('/prescriptions/:id', validateObjectId('id'), getPrescriptionById);

// Dispense
router.post('/dispense/:prescriptionId', validateObjectId('prescriptionId'), dispensePrescription);

// Alerts
router.get('/alerts', getAlerts);

module.exports = router;
