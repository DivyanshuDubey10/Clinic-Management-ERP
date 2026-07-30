const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be null for failed login attempts or anonymous requests
    },
    userName: {
        type: String,
        default: 'System / Anonymous'
    },
    userRole: {
        type: String,
        default: 'Anonymous'
    },
    action: {
        type: String,
        required: [true, 'Audit action is required'],
        enum: [
            'LOGIN_SUCCESS',
            'LOGIN_FAILED',
            'LOGOUT',
            'VIEW_PATIENT_RECORD',
            'CREATE_PATIENT',
            'UPDATE_PATIENT',
            'DELETE_PATIENT',
            'CREATE_APPOINTMENT',
            'UPDATE_APPOINTMENT',
            'CANCEL_APPOINTMENT',
            'CREATE_CONSULTATION',
            'UPDATE_CONSULTATION',
            'CREATE_INVOICE',
            'RECORD_PAYMENT',
            'UPDATE_SETTINGS',
            'CREATE_BRANCH',
            'DELETE_BRANCH',
            'EXPORT_AUDIT_LOGS',
            'UNAUTHORIZED_ACCESS_ATTEMPT',
            'OTHER'
        ],
        default: 'OTHER'
    },
    resourceType: {
        type: String,
        enum: ['Patient', 'Appointment', 'Consultation', 'Prescription', 'LabOrder', 'Invoice', 'Medicine', 'Setting', 'User', 'Auth', 'System'],
        default: 'System'
    },
    resourceId: {
        type: String, // String representation of ObjectId or resource identifier
        default: null
    },
    details: {
        type: String,
        required: true // Human-readable description of what occurred (HIPAA compliance explanation)
    },
    ipAddress: {
        type: String,
        default: '0.0.0.0'
    },
    userAgent: {
        type: String,
        default: 'Unknown Device'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed // Optional JSON object to store before/after diffs or query parameters
    }
}, {
    timestamps: true
});

// Indexing for high-performance querying and filtering by auditors
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
