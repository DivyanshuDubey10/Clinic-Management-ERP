const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController');

// Apply protection to all dashboard routes
router.use(protect);

router.route('/')
    .get(getDashboardStats);

module.exports = router;
