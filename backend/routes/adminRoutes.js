const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');
const {
    getClinicSettings,
    getBranchSettingById,
    createBranchSetting,
    updateBranchSetting,
    deleteBranchSetting,
    getAuditLogs,
    getAuditLogById,
    exportAuditLogs
} = require('../controllers/adminController');

const { validateObjectId, validateBody } = require('../middlewares/validationMiddleware');

// Require authentication for all system administration routes
router.use(protect);

// 9.1 Clinic / Branch Settings Routes
// All staff can view settings (e.g. for working hours, GST tax rates, clinic address)
router.get('/settings', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR), getClinicSettings);
router.get('/settings/:identifier', authorize(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR), getBranchSettingById);

// Only Admin can create, modify, or delete clinic/branch settings
router.post('/settings', authorize(ROLES.ADMIN), validateBody('branchName', 'branchCode'), createBranchSetting);
router.put('/settings/:id', authorize(ROLES.ADMIN), validateObjectId('id'), updateBranchSetting);
router.delete('/settings/:id', authorize(ROLES.ADMIN), validateObjectId('id'), deleteBranchSetting);

// 9.2 Audit Log Viewer Routes (HIPAA Compliance & Access Logs)
// Strictly restricted to Admin role for security and compliance
router.get('/audit-logs', authorize(ROLES.ADMIN), validateObjectId('userId'), getAuditLogs);
router.get('/audit-logs/export', authorize(ROLES.ADMIN), exportAuditLogs);
router.get('/audit-logs/:id', authorize(ROLES.ADMIN), validateObjectId('id'), getAuditLogById);

module.exports = router;
