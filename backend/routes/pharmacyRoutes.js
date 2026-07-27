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

// All pharmacy routes require authentication
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.RECEPTIONIST));

// Item Master
router.route('/medicines')
    .post(addMedicine)
    .get(getMedicines);

// Stock In / Purchase
router.post('/purchase', recordPurchase);

// Dispense
router.post('/dispense/:prescriptionId', dispensePrescription);

// Alerts
router.get('/alerts', getAlerts);

module.exports = router;
