const express = require('express');
const { 
    createStaff, 
    getAllStaff, 
    getStaffById, 
    updateStaff, 
    deleteStaff 
} = require('../controllers/staffController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();
const { ROLES } = require('../constants/roles');

// All staff routes require authentication and Admin role
router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.route('/')
    .post(createStaff)
    .get(getAllStaff);

router.route('/:id')
    .get(getStaffById)
    .put(updateStaff)
    .delete(deleteStaff);

module.exports = router;
