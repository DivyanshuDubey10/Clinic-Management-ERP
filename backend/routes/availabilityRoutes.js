const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const {
    setAvailability,
    getAvailability
} = require('../controllers/availabilityController');

router.use(protect);

// Anyone logged in can view availability to book
router.get('/:doctorId', getAvailability);

// Only Admins and Doctors can set availability
router.post('/', authorize(ROLES.ADMIN, ROLES.DOCTOR), setAvailability);

module.exports = router;
