const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const { getDashboardStats } = require('../controllers/dashboardController');

// Apply protection to all dashboard routes
router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.route('/')
    .get(getDashboardStats);

module.exports = router;
