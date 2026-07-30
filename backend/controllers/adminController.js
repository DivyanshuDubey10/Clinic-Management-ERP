const mongoose = require('mongoose');
const ClinicSetting = require('../models/ClinicSetting');
const AuditLog = require('../models/AuditLog');
const logAudit = require('../utils/auditLogger');
const { ROLES } = require('../constants/roles');

// @desc    9.1 Get All Clinic / Branch Settings
// @route   GET /api/admin/settings
// @access  Private (Admin, Receptionist, Doctor)
exports.getClinicSettings = async (req, res) => {
    try {
        let settings = await ClinicSetting.find({ isActive: true }).sort({ isPrimary: -1, branchName: 1 });

        // If no settings exist in DB yet, seed a default primary branch automatically
        if (!settings || settings.length === 0) {
            const defaultSetting = await ClinicSetting.create({
                clinicName: 'Healthcare Excellence Clinic ERP',
                branchName: 'Main Medical Center',
                branchCode: 'MAIN-01',
                isPrimary: true
            });
            settings = [defaultSetting];
        }

        res.status(200).json({
            success: true,
            count: settings.length,
            data: settings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    9.1 Get Single Branch Setting by ID or Code
// @route   GET /api/admin/settings/:identifier
// @access  Private (Admin, Receptionist, Doctor)
exports.getBranchSettingById = async (req, res) => {
    try {
        const { identifier } = req.params;
        let query = {};

        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: identifier };
        } else {
            query = { branchCode: identifier.toUpperCase() };
        }

        const setting = await ClinicSetting.findOne(query);

        if (!setting) {
            return res.status(404).json({ success: false, message: 'Branch setting not found' });
        }

        res.status(200).json({
            success: true,
            data: setting
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    9.1 Create New Clinic / Branch Configuration
// @route   POST /api/admin/settings
// @access  Private (Admin only)
exports.createBranchSetting = async (req, res) => {
    try {
        const { branchCode, isPrimary } = req.body;

        if (!branchCode) {
            return res.status(400).json({ success: false, message: 'Branch code is required' });
        }

        // Check if branchCode already exists
        const existingBranch = await ClinicSetting.findOne({ branchCode: branchCode.toUpperCase() });
        if (existingBranch) {
            return res.status(400).json({ success: false, message: `Branch with code ${branchCode.toUpperCase()} already exists` });
        }

        // If new branch is set as primary, unset isPrimary on all other branches
        if (isPrimary === true) {
            await ClinicSetting.updateMany({}, { $set: { isPrimary: false } });
        }

        const newBranch = await ClinicSetting.create({
            ...req.body,
            branchCode: branchCode.toUpperCase(),
            updatedBy: req.user._id
        });

        // Record HIPAA compliance audit log
        await logAudit({
            req,
            action: 'CREATE_BRANCH',
            resourceType: 'Setting',
            resourceId: newBranch._id,
            details: `Created new branch configuration: ${newBranch.branchName} (${newBranch.branchCode})`,
            metadata: { branchCode: newBranch.branchCode, isPrimary: newBranch.isPrimary }
        });

        res.status(201).json({
            success: true,
            message: 'New branch configuration created successfully',
            data: newBranch
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    9.1 Update Clinic / Branch Setting (Working hours, GST, tax, contact info)
// @route   PUT /api/admin/settings/:id
// @access  Private (Admin only)
exports.updateBranchSetting = async (req, res) => {
    try {
        const { isPrimary } = req.body;
        let setting = await ClinicSetting.findById(req.params.id);

        if (!setting) {
            return res.status(404).json({ success: false, message: 'Branch setting not found' });
        }

        // If setting this branch as primary, unset isPrimary on all others
        if (isPrimary === true && !setting.isPrimary) {
            await ClinicSetting.updateMany({ _id: { $ne: setting._id } }, { $set: { isPrimary: false } });
        }

        setting = await ClinicSetting.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user._id },
            { new: true, runValidators: true }
        );

        // Record HIPAA compliance audit log
        await logAudit({
            req,
            action: 'UPDATE_SETTINGS',
            resourceType: 'Setting',
            resourceId: setting._id,
            details: `Updated clinic/branch settings for ${setting.branchName} (${setting.branchCode})`,
            metadata: { updatedFields: Object.keys(req.body) }
        });

        res.status(200).json({
            success: true,
            message: 'Branch settings updated successfully',
            data: setting
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    9.1 Delete Branch Setting
// @route   DELETE /api/admin/settings/:id
// @access  Private (Admin only)
exports.deleteBranchSetting = async (req, res) => {
    try {
        const setting = await ClinicSetting.findById(req.params.id);

        if (!setting) {
            return res.status(404).json({ success: false, message: 'Branch setting not found' });
        }

        if (setting.isPrimary) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete the Primary clinic branch. Please reassign primary status to another branch first.'
            });
        }

        await setting.deleteOne();

        // Record HIPAA compliance audit log
        await logAudit({
            req,
            action: 'DELETE_BRANCH',
            resourceType: 'Setting',
            resourceId: req.params.id,
            details: `Deleted branch configuration: ${setting.branchName} (${setting.branchCode})`
        });

        res.status(200).json({
            success: true,
            message: 'Branch setting deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    9.2 Get Audit Log Viewer (Filterable compliance logs)
// @route   GET /api/admin/audit-logs
// @access  Private (Admin only)
exports.getAuditLogs = async (req, res) => {
    try {
        const {
            userId,
            userRole,
            action,
            resourceType,
            resourceId,
            startDate,
            endDate,
            page = 1,
            limit = 20
        } = req.query;

        let query = {};

        if (userId && mongoose.Types.ObjectId.isValid(userId)) query.userId = userId;
        if (userRole) query.userRole = userRole;
        if (action) query.action = action;
        if (resourceType) query.resourceType = resourceType;
        if (resourceId) query.resourceId = resourceId;

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                query.createdAt.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const total = await AuditLog.countDocuments(query);

        const logs = await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: logs.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            data: logs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    9.2 Get Audit Log by ID
// @route   GET /api/admin/audit-logs/:id
// @access  Private (Admin only)
exports.getAuditLogById = async (req, res) => {
    try {
        const log = await AuditLog.findById(req.params.id);

        if (!log) {
            return res.status(404).json({ success: false, message: 'Audit log entry not found' });
        }

        res.status(200).json({
            success: true,
            data: log
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    9.2 Export Audit Logs (JSON/CSV formatted for compliance inspection)
// @route   GET /api/admin/audit-logs/export
// @access  Private (Admin only)
exports.exportAuditLogs = async (req, res) => {
    try {
        const { startDate, endDate, format = 'json' } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(1000); // Limit max export to 1000 logs

        // Log this compliance export event
        await logAudit({
            req,
            action: 'EXPORT_AUDIT_LOGS',
            resourceType: 'System',
            details: `Admin exported ${logs.length} compliance audit logs in ${format.toUpperCase()} format`,
            metadata: { exportedCount: logs.length, format }
        });

        if (format.toLowerCase() === 'csv') {
            const csvHeader = 'ID,Timestamp,User Name,User Role,Action,Resource Type,Resource ID,IP Address,Details\n';
            const csvRows = logs.map(l => {
                const cleanDetails = (l.details || '').replace(/"/g, '""');
                return `"${l._id}","${l.createdAt.toISOString()}","${l.userName}","${l.userRole}","${l.action}","${l.resourceType}","${l.resourceId || ''}","${l.ipAddress}","${cleanDetails}"`;
            }).join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="HIPAA-Audit-Logs-${Date.now()}.csv"`);
            return res.status(200).send(csvHeader + csvRows);
        }

        res.status(200).json({
            success: true,
            exportedCount: logs.length,
            exportedAt: new Date(),
            data: logs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
