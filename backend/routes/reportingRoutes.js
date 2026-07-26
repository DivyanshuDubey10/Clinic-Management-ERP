const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const {
    getClinicPerformanceDashboard,
    getDoctorWiseReport,
    getServiceWiseReport,
    getFinancialSummaryReport,
    getPatientDemographicsReport
} = require('../controllers/reportingController');

// All reporting routes require authentication
router.use(protect);

// @route   GET /api/reports/performance
// @desc    8.1 Clinic Performance Dashboard (Patient count, revenue, doctor-wise volume)
// @access  Private (Admin, Receptionist)
router.get('/performance', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), getClinicPerformanceDashboard);

// @route   GET /api/reports/doctor-wise
// @desc    8.2 Doctor-wise Filterable Performance Report
// @access  Private (Admin, Receptionist, Doctor)
router.get('/doctor-wise', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR), getDoctorWiseReport);

// @route   GET /api/reports/service-wise
// @desc    8.2 Service-wise / Item-wise Revenue & Volume Report
// @access  Private (Admin, Receptionist)
router.get('/service-wise', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), getServiceWiseReport);

// @route   GET /api/reports/financials
// @desc    8.2 Financial Summary & Insurance Claims Report
// @access  Private (Admin, Receptionist)
router.get('/financials', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), getFinancialSummaryReport);

// @route   GET /api/reports/demographics
// @desc    8.2 Patient Demographics & Acquisition Trend Report
// @access  Private (Admin, Receptionist)
router.get('/demographics', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), getPatientDemographicsReport);

module.exports = router;
