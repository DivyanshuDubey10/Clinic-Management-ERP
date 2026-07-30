const mongoose = require('mongoose');

/**
 * Helper to check if a value is a valid 24-character hex Mongoose ObjectId.
 */
const isValidObjectId = (id) => {
    return id && mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
};

/**
 * Middleware to validate Mongoose ObjectIds in req.params or req.query.
 * Usage in routes: validateObjectId('id', 'doctorId')
 */
const validateObjectId = (...paramNames) => {
    return (req, res, next) => {
        for (const param of paramNames) {
            const val = req.params[param] !== undefined ? req.params[param] : req.query[param];
            if (val !== undefined && val !== null) {
                if (!isValidObjectId(val)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid format for ID parameter: ${param}`
                    });
                }
            }
        }
        next();
    };
};

/**
 * Middleware to validate required fields in req.body.
 * Usage in routes: validateBody('name', 'email', 'phone')
 */
const validateBody = (...fieldNames) => {
    return (req, res, next) => {
        const missingFields = [];
        for (const field of fieldNames) {
            const val = req.body[field];
            if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
                missingFields.push(field);
            }
        }
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please provide all required fields: ${missingFields.join(', ')}`
            });
        }
        next();
    };
};

/**
 * Middleware to validate required parameters in req.query.
 * Usage in routes: validateQuery('doctorId', 'date')
 */
const validateQuery = (...fieldNames) => {
    return (req, res, next) => {
        const missingFields = [];
        for (const field of fieldNames) {
            const val = req.query[field];
            if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
                missingFields.push(field);
            }
        }
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please provide required query parameters: ${missingFields.join(', ')}`
            });
        }
        next();
    };
};

/**
 * Middleware to validate array properties in req.body (must be an array with at least 1 item).
 * Usage in routes: validateArray('items', 'medications')
 */
const validateArray = (...fieldNames) => {
    return (req, res, next) => {
        for (const field of fieldNames) {
            const val = req.body[field];
            if (!Array.isArray(val) || val.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: `${field} must be a non-empty array`
                });
            }
        }
        next();
    };
};

/**
 * Middleware to validate Razorpay payment verification details in req.body.
 */
const validatePaymentSignature = (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: 'Missing required Razorpay payment verification details (razorpay_order_id, razorpay_payment_id, razorpay_signature)'
        });
    }
    next();
};

module.exports = {
    validateObjectId,
    validateBody,
    validateQuery,
    validateArray,
    validatePaymentSignature
};
