const mongoose = require('mongoose');
const LabOrder = require('../models/LabOrder');
const Notification = require('../models/Notification');

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

// @desc    Create new lab order
// @route   POST /api/lab-orders
// @access  Private
const createLabOrder = async (req, res) => {
    try {
        const { patientId, doctorId, consultationId, tests } = req.body;

        if (!patientId || !doctorId || !consultationId || !tests || tests.length === 0) {
            return res.status(400).json({ success: false, message: 'patientId, doctorId, consultationId, and tests are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(consultationId)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format provided' });
        }

        const labOrder = await LabOrder.create({
            patientId,
            doctorId,
            consultationId,
            tests,
            status: 'Pending'
        });

        if (req.user) {
            await Notification.create({
                user: req.user._id,
                title: 'Lab Order Created',
                message: `New lab order has been created.`,
                type: 'success',
                link: `/lab-orders/${labOrder._id}`
            });
        }

        res.status(201).json({ success: true, data: labOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update lab order
// @route   PUT /api/lab-orders/:id
// @access  Private
const updateLabOrder = async (req, res) => {
    try {
        const { status, result, notes } = req.body;
        const labOrder = await LabOrder.findById(req.params.id);

        if (!labOrder) {
            return res.status(404).json({ success: false, message: 'Lab order not found' });
        }

        if (status) labOrder.status = status;

        if (result || notes) {
            // we will push to results array or update it
            labOrder.results.push({
                parsedText: result || '',
                notes: notes || '',
                uploadedAt: Date.now()
            });
        }

        await labOrder.save();

        if (req.user) {
            await Notification.create({
                user: req.user._id,
                title: 'Lab Order Updated',
                message: `Lab order status or results have been updated.`,
                type: 'info',
                link: `/lab-orders/${labOrder._id}`
            });
        }

        res.status(200).json({ success: true, data: labOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getLabOrders,
    getLabOrderById,
    createLabOrder,
    updateLabOrder
};
