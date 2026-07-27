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
const { validateObjectId, validateBody } = require('../middlewares/validationMiddleware');

// All staff routes require authentication and Admin role
router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.route('/')
    .post(validateBody('name', 'email', 'password', 'role'), createStaff)
    .get(getAllStaff);

router.route('/:id')
    .get(validateObjectId('id'), getStaffById)
    .put(validateObjectId('id'), updateStaff)
    .delete(validateObjectId('id'), deleteStaff);

module.exports = router;
