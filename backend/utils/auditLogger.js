const AuditLog = require('../models/AuditLog');

/**
 * Helper utility to record HIPAA compliance and system audit logs asynchronously.
 * Designed to be resilient so log failures never block or crash the main API response.
 */
const logAudit = async ({
    req = null,
    userId = null,
    userName = 'System',
    userRole = 'System',
    action = 'OTHER',
    resourceType = 'System',
    resourceId = null,
    details = 'System audit event occurred',
    metadata = null
}) => {
    try {
        let finalUserId = userId;
        let finalUserName = userName;
        let finalUserRole = userRole;
        let ipAddress = '0.0.0.0';
        let userAgent = 'Unknown';

        if (req) {
            if (req.user) {
                finalUserId = req.user._id || userId;
                finalUserName = req.user.name || userName;
                finalUserRole = req.user.role || userRole;
            }
            ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
            userAgent = req.headers['user-agent'] || 'Unknown Device';
        }

        await AuditLog.create({
            userId: finalUserId,
            userName: finalUserName,
            userRole: finalUserRole,
            action,
            resourceType,
            resourceId: resourceId ? String(resourceId) : null,
            details,
            ipAddress,
            userAgent,
            metadata
        });
    } catch (err) {
        // Silently catch and log to console so compliance logger never breaks primary business logic
        console.error('[AUDIT_LOGGER_ERROR] Failed to save audit log:', err.message);
    }
};

module.exports = logAudit;
