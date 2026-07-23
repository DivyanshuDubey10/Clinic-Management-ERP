const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const { getDashboardStats, getDoctorDashboard } = require('../controllers/dashboardController');

// Apply protection to all dashboard routes
router.use(protect);

// @route   GET /api/dashboard
router.get('/', protect, authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), getDashboardStats);

// @route   GET /api/dashboard/doctor
router.get('/doctor', protect, authorize(ROLES.DOCTOR), getDoctorDashboard);

module.exports = router;
