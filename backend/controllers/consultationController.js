const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const LabOrder = require('../models/LabOrder');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const { HfInference } = require('@huggingface/inference');
const pdfParse = require('pdf-parse');

// @desc    Create a new consultation note (S.O.A.P)
// @route   POST /api/consultations
// @access  Private (Doctor)
const createConsultation = async (req, res) => {
    try {
        const { appointmentId, symptoms, examinationFindings, diagnosis, treatmentPlan, followUpDate } = req.body;

        // Verify appointment exists
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Check if consultation already exists for this appointment
        const existingConsultation = await Consultation.findOne({ appointmentId });
        if (existingConsultation) {
            return res.status(400).json({ success: false, message: 'Consultation already exists for this appointment' });
        }

        const consultation = await Consultation.create({
            appointmentId,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            symptoms,
            examinationFindings,
            diagnosis,
            treatmentPlan,
            followUpDate,
            status: 'Completed'
        });

        // Optionally, update the appointment status to 'Completed'
        appointment.status = 'Completed';
        await appointment.save();

        res.status(201).json({ success: true, data: consultation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update an existing consultation note
// @route   PUT /api/consultations/:id
// @access  Private (Doctor/Admin)
const updateConsultation = async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ success: false, message: 'Consultation not found' });
        }

        const allowedFields = ['symptoms', 'examinationFindings', 'diagnosis', 'treatmentPlan', 'followUpDate', 'status'];
        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                consultation[field] = req.body[field];
            }
        }

        await consultation.save();
        res.status(200).json({ success: true, data: consultation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get complete consultation details (with Prescriptions & Lab Orders)
// @route   GET /api/consultations/:appointmentId
// @access  Private (Doctor, Admin, Patient)
const getConsultationByAppointment = async (req, res) => {
    try {
        const consultation = await Consultation.findOne({ appointmentId: req.params.appointmentId });
        
        if (!consultation) {
            return res.status(404).json({ success: false, message: 'Consultation not found for this appointment' });
        }

        // Fetch associated prescription and lab orders dynamically
        const prescription = await Prescription.findOne({ consultationId: consultation._id });
        const labOrders = await LabOrder.find({ consultationId: consultation._id });

        // Fetch patient and doctor details
        const patient = await Patient.findById(consultation.patientId).select('firstName lastName email phone gender dateOfBirth');
        const doctor = await User.findById(consultation.doctorId).select('firstName lastName specialization');

        res.status(200).json({
            success: true,
            data: {
                consultation,
                patientId: patient,
                doctorId: doctor,
                prescription,
                labOrders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all consultations
// @route   GET /api/consultations
// @access  Private
const getConsultations = async (req, res) => {
    try {
        const { doctorId, status, search } = req.query;
        // Check for patientId in either query or params (for the /patient/:patientId route)
        const patientId = req.query.patientId || req.params.patientId;
        
        let query = {};

        if (patientId) {
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(patientId)) {
                query.patientId = patientId;
            } else {
                const patient = await Patient.findOne({ patientId });
                if (patient) {
                    query.patientId = patient._id;
                } else {
                    return res.status(200).json({ success: true, count: 0, data: [] });
                }
            }
        }
        if (doctorId) query.doctorId = doctorId;
        if (status) query.status = status;

        // If search is provided, we might want to search by symptoms or diagnosis,
        // or join with patient/doctor. For simplicity, we filter by diagnosis here.
        if (search) {
            query.$or = [
                { diagnosis: { $regex: search, $options: 'i' } },
                { symptoms: { $regex: search, $options: 'i' } }
            ];
        }

        const consultations = await Consultation.find(query)
            .populate('patientId', 'firstName lastName patientId')
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ success: true, count: consultations.length, data: consultations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get consultation by ID
// @route   GET /api/consultations/:id
// @access  Private
const getConsultationById = async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id)
            .populate('patientId', 'firstName lastName email phone gender dateOfBirth')
            .populate('doctorId', 'name specialization');
        
        if (!consultation) {
            return res.status(404).json({ success: false, message: 'Consultation not found' });
        }

        const prescription = await Prescription.findOne({ consultationId: consultation._id });
        const labOrders = await LabOrder.find({ consultationId: consultation._id });

        res.status(200).json({
            success: true,
            data: {
                consultation,
                prescription,
                labOrders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add Prescription to Consultation
// @route   POST /api/consultations/:id/prescription
// @access  Private (Doctor)
const addPrescription = async (req, res) => {
    try {
        const consultationId = req.params.id;
        const { medications, notes } = req.body;

        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
            return res.status(404).json({ success: false, message: 'Consultation not found' });
        }

        // Check for existing prescription
        let prescription = await Prescription.findOne({ consultationId });
        
        if (prescription) {
            // Update existing
            prescription.medications = medications;
            prescription.notes = notes;
            await prescription.save();
        } else {
            // Create new
            console.log("================================");
            console.log("MEDICATIONS RECEIVED:");
            console.log(JSON.stringify(medications, null, 2));
            console.log("================================");

            prescription = await Prescription.create({
                consultationId,
                patientId: consultation.patientId,
                doctorId: consultation.doctorId,
                medications,
                notes,
                status: 'Pending'
            });
        }

        res.status(201).json({ success: true, data: prescription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Order Lab Tests
// @route   POST /api/consultations/:id/lab-orders
// @access  Private (Doctor)
const createLabOrder = async (req, res) => {
    try {
        const consultationId = req.params.id;
        const { tests } = req.body;

        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
            return res.status(404).json({ success: false, message: 'Consultation not found' });
        }

        const labOrder = await LabOrder.create({
            consultationId,
            patientId: consultation.patientId,
            doctorId: consultation.doctorId,
            tests
        });

        res.status(201).json({ success: true, data: labOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Upload/Attach Lab Results to an Order (with OCR/PDF parsing)
// @route   PUT /api/consultations/lab-orders/:orderId/results
// @access  Private (Admin, Doctor, Receptionist)
const uploadLabResults = async (req, res) => {
    try {
        let parsedText = req.body.parsedText || '';
        let documentUrl = req.body.documentUrl || '';
        const notes = req.body.notes || '';

        // If a file was uploaded via multer
        if (req.file) {
            // Store a local mock URL for the file (in production, upload to S3)
            documentUrl = `/uploads/${req.file.originalname}`;

            const fileBuffer = req.file.buffer;
            const mimetype = req.file.mimetype;

            if (mimetype === 'application/pdf') {
                // Parse PDF
                try {
                    const pdfData = await pdfParse(fileBuffer);
                    parsedText = pdfData.text;
                } catch (parseErr) {
                    console.error("PDF Parse error:", parseErr);
                }
            } else if (mimetype.startsWith('image/')) {
                // Parse Image with HuggingFace Inference API
                try {
                    const hfToken = process.env.HF_ACCESS_TOKEN;
                    if (!hfToken || hfToken === 'your_hugging_face_token_here') {
                        throw new Error('OCR Configuration Error: Hugging Face API token (HF_ACCESS_TOKEN) is missing in backend .env file.');
                    }
                    
                    const hf = new HfInference(hfToken);
                    const modelId = process.env.HF_MODEL_ID || 'stepfun-ai/GOT-OCR2_0'; // Default to GOT-OCR2.0 or let admin override via ENV

                    // Image needs to be passed as Blob
                    const blob = new Blob([fileBuffer], { type: mimetype });
                    
                    const result = await hf.imageToText({
                        data: blob,
                        model: modelId
                    });
                    
                    parsedText = result.generated_text || '';
                } catch (ocrErr) {
                    console.error("HuggingFace OCR error:", ocrErr);
                    // Do not swallow the error. Send it to the frontend so they know exactly why it failed.
                    return res.status(500).json({ 
                        success: false, 
                        message: `OCR Processing Failed: ${ocrErr.message}. Make sure you are using Node 18+ and have a valid HF_ACCESS_TOKEN.` 
                    });
                }
            }
        }
        
        const labOrder = await LabOrder.findById(req.params.orderId);
        if (!labOrder) {
            return res.status(404).json({ success: false, message: 'Lab order not found' });
        }

        labOrder.results.push({
            documentUrl,
            parsedText,
            notes,
            uploadedAt: Date.now()
        });

        labOrder.status = 'Completed';
        await labOrder.save();

        res.status(200).json({ success: true, data: labOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Download Prescription PDF
// @route   GET /api/consultations/:id/prescription/download
// @access  Private
const downloadPrescriptionPDF = async (req, res) => {
    try {
        const consultationId = req.params.id;

        const prescription = await Prescription.findOne({ consultationId });
        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        const patient = await Patient.findById(prescription.patientId);
        const doctor = await User.findById(prescription.doctorId);

        // Generate PDF
        const doc = new PDFDocument({ margin: 50 });

        // Pipe directly to HTTP response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=prescription_${patient.firstName}_${patient.lastName}.pdf`);
        doc.pipe(res);

        // Header
        doc.fontSize(20).text('CLINIC ERP - PRESCRIPTION', { align: 'center' });
        doc.moveDown();
        
        // Doctor & Patient Info
        const doctorName = doctor ? doctor.name : 'Attending Physician';
        const doctorSpec = doctor ? (doctor.specialization || 'General') : 'General';
        doc.fontSize(12).text(`Doctor: Dr. ${doctorName} (${doctorSpec})`);
        doc.text(`Date: ${prescription.updatedAt.toLocaleDateString()}`);
        doc.moveDown();
        doc.text(`Patient: ${patient.firstName} ${patient.lastName}`);
        doc.text(`Age/Gender: ${patient.age || 'N/A'} / ${patient.gender}`);
        doc.moveDown(2);

        // Medications
        doc.fontSize(16).text('Medications:');
        doc.moveDown();
        
        prescription.medications.forEach((med, index) => {
            doc.fontSize(12).text(`${index + 1}. ${med.drugName}`);
            doc.fontSize(10).text(`   Dosage: ${med.dosage} | Freq: ${med.frequency} | Duration: ${med.duration}`);
            if (med.instructions) {
                doc.text(`   Instructions: ${med.instructions}`);
            }
            doc.moveDown();
        });

        if (prescription.notes) {
            doc.moveDown();
            doc.fontSize(14).text('Additional Notes:');
            doc.fontSize(10).text(prescription.notes);
        }

        doc.end();

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @desc Delete Consultation
// @route DELETE /api/consultations/:id
// @access Private (Doctor/Admin)

const deleteConsultation = async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: "Consultation not found"
            });
        }

        // Delete linked prescription
        await Prescription.deleteMany({
            consultationId: consultation._id
        });

        // Delete linked lab orders
        await LabOrder.deleteMany({
            consultationId: consultation._id
        });

        // Delete consultation
        await Consultation.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Consultation deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createConsultation,
    updateConsultation,
    getConsultations,
    getConsultationById,
    getConsultationByAppointment,
    addPrescription,
    createLabOrder,
    uploadLabResults,
    downloadPrescriptionPDF,
    deleteConsultation,
};
