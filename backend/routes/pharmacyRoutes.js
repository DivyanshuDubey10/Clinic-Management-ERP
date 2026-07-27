const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const {
    addMedicine,
    getMedicines,
    recordPurchase,
    dispensePrescription,
    getAlerts
} = require('../controllers/pharmacyController');
const { validateObjectId, validateBody, validateArray } = require('../middlewares/validationMiddleware');

// All pharmacy routes require authentication
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.RECEPTIONIST));

// Item Master
router.route('/medicines')
    .post(validateBody('name', 'genericName', 'category', 'manufacturer', 'unitPrice'), addMedicine)
    .get(getMedicines);

// Stock In / Purchase
router.post('/purchase', validateBody('supplierName', 'invoiceNumber', 'items'), validateArray('items'), recordPurchase);

// Dispense
router.post('/dispense/:prescriptionId', validateObjectId('prescriptionId'), validateBody('items'), validateArray('items'), dispensePrescription);

// Alerts
router.get('/alerts', getAlerts);

module.exports = router;
