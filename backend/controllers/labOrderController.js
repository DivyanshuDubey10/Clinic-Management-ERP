const LabOrder = require('../models/LabOrder');

// @desc    Get all lab orders (with filters)
// @route   GET /api/lab-orders
// @access  Private
const getLabOrders = async (req, res) => {
    try {
        const { patientId, doctorId, status, consultationId } = req.query;
        let query = {};

        if (patientId) query.patientId = patientId;
        if (doctorId) query.doctorId = doctorId;
        if (status) query.status = status;
        if (consultationId) query.consultationId = consultationId;

        const labOrders = await LabOrder.find(query)
            .populate('patientId', 'firstName lastName phone')
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: labOrders.length, data: labOrders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get lab order by ID
// @route   GET /api/lab-orders/:id
// @access  Private
const getLabOrderById = async (req, res) => {
    try {
        const labOrder = await LabOrder.findById(req.params.id)
            .populate('patientId', 'firstName lastName phone')
            .populate('doctorId', 'name specialization');
            
        if (!labOrder) {
            return res.status(404).json({ success: false, message: 'Lab order not found' });
        }
        res.status(200).json({ success: true, data: labOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getLabOrders,
    getLabOrderById
};
