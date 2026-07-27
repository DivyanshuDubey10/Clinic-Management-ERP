const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const LabOrder = require('../models/LabOrder');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const { HfInference } = require('@huggingface/inference');
const pdfParse = require('pdf-parse');

// @desc    Create a new consultation note (SOAP)
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
                patient,
                doctor,
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
            prescription = await Prescription.create({
                consultationId,
                patientId: consultation.patientId,
                doctorId: consultation.doctorId,
                medications,
                notes
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
                    const hf = new HfInference(process.env.HF_ACCESS_TOKEN);
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
        doc.fontSize(12).text(`Doctor: Dr. ${doctor.firstName} ${doctor.lastName} (${doctor.specialization || 'General'})`);
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

module.exports = {
    createConsultation,
    getConsultationByAppointment,
    addPrescription,
    createLabOrder,
    uploadLabResults,
    downloadPrescriptionPDF
};
