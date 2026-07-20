const Patient = require('../models/Patient');

// @desc    Create Patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res) => {
    try {
        const patientData = { ...req.body };
        
        // Add createdBy from logged-in user if available
        if (req.user) {
            patientData.createdBy = req.user._id;
        }

        // Validate uniqueness of phone number
        if (patientData.phone) {
            const existingPatient = await Patient.findOne({ phone: patientData.phone });
            if (existingPatient) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Phone number already exists' 
                });
            }
        }

        const patient = await Patient.create(patientData);

        res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            data: patient
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server Error' 
        });
    }
};

// @desc    Get All Patients
// @route   GET /api/patients
// @access  Private
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('createdBy', 'name email');
        
        res.status(200).json({
            success: true,
            message: 'Patients retrieved successfully',
            data: patients
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server Error' 
        });
    }
};

// @desc    Get Patient By ID
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('createdBy', 'name email');
        
        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Patient retrieved successfully',
            data: patient
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server Error' 
        });
    }
};

// @desc    Update Patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
    try {
        // If updating phone, check if it already belongs to another patient
        if (req.body.phone) {
            const existingPatient = await Patient.findOne({ 
                phone: req.body.phone, 
                _id: { $ne: req.params.id } 
            });
            
            if (existingPatient) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Phone number already exists for another patient' 
                });
            }
        }

        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Patient updated successfully',
            data: patient
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server Error' 
        });
    }
};

// @desc    Delete Patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Patient deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server Error' 
        });
    }
};
