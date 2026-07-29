const Prescription = require('../models/Prescription');

// @desc    Get all prescriptions (with filters)
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res) => {
    try {
        const { patientId, doctorId, status, consultationId } = req.query;
        let query = {};

        if (patientId) query.patientId = patientId;
        if (doctorId) query.doctorId = doctorId;
        if (status) query.status = status;
        if (consultationId) query.consultationId = consultationId;

        const prescriptions = await Prescription.find(query)
            .populate('patientId', 'firstName lastName phone')
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patientId', 'firstName lastName phone')
            .populate('doctorId', 'name specialization');
            
        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }
        res.status(200).json({ success: true, data: prescription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getPrescriptions,
    getPrescriptionById
};
