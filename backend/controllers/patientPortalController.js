const Razorpay = require('razorpay');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const LabOrder = require('../models/LabOrder');
const Invoice = require('../models/Invoice');
const { ROLES } = require('../constants/roles');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// Helper: Match Patient Record for Logged-in User
const getPatientRecord = async (userObj) => {
    const user = await User.findById(userObj._id);
    if (!user) {
        const error = new Error('User account not found.');
        error.statusCode = 404;
        throw error;
    }

    let patient = await Patient.findOne({
        $or: [
            { email: { $regex: new RegExp(`^${user.email}$`, 'i') } },
            { phone: user.phone }
        ]
    });

    if (!patient) {
        // Auto-heal: Create a patient profile if missing for older test accounts
        if (user.role === ROLES.PATIENT || user.role === 'patient' || user.role === 'Patient') {
            const nameParts = (user.name || '').trim().split(' ');
            const firstName = nameParts[0] || 'Patient';
            const lastName = nameParts.slice(1).join(' ') || 'User';

            patient = await Patient.create({
                firstName,
                lastName,
                email: user.email,
                phone: user.phone,
                createdBy: user._id
            });
        } else {
            const error = new Error('Patient profile not found. Please complete your registration or contact clinic reception to link your profile.');
            error.statusCode = 404;
            throw error;
        }
    }

    return patient;
};

// @desc    7.1 Get Patient Dashboard Summary
// @route   GET /api/portal/dashboard
// @access  Private (Patient, Admin, Receptionist)
exports.getPatientDashboard = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);

        const now = new Date();
        const upcomingAppointments = await Appointment.find({
            patientId: patient._id,
            status: { $in: ['booked', 'checked-in'] },
            appointmentDate: { $gte: now }
        })
        .populate('doctorId', 'name specialization consultationHours')
        .sort({ appointmentDate: 1 })
        .limit(10);

        const recentPrescriptions = await Prescription.find({ patientId: patient._id })
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentLabOrders = await LabOrder.find({ patientId: patient._id })
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 })
            .limit(5);

        const outstandingInvoices = await Invoice.find({
            patientId: patient._id,
            'billingDetails.amountDue': { $gt: 0 },
            status: { $ne: 'Cancelled' }
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                profile: patient,
                upcomingAppointments,
                recentPrescriptions,
                recentLabOrders,
                outstandingInvoices
            }
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    7.2 Book Appointment (Self-Service)
// @route   POST /api/portal/appointments
// @access  Private
exports.bookAppointment = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const { doctorId, appointmentDate, duration = 30, reasonForVisit, appointmentType = 'Online' } = req.body;

        if (!doctorId || !appointmentDate || !reasonForVisit) {
            return res.status(400).json({ success: false, message: 'Doctor, date/time, and reason for visit are required' });
        }

        const dateObj = new Date(appointmentDate);
        if (dateObj < new Date()) {
            return res.status(400).json({ success: false, message: 'Appointment date must be in the future' });
        }

        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== ROLES.DOCTOR) {
            return res.status(404).json({ success: false, message: 'Selected doctor not found' });
        }

        // Check duplicate or overlapping booking
        const duplicate = await Appointment.findOne({
            $or: [
                { doctorId, appointmentDate: dateObj, status: { $ne: 'cancelled' } },
                { patientId: patient._id, appointmentDate: dateObj, status: { $ne: 'cancelled' } }
            ]
        });

        if (duplicate) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked or you already have an active appointment at this time'
            });
        }

        const appointment = await Appointment.create({
            patientId: patient._id,
            doctorId,
            appointmentDate: dateObj,
            duration: Number(duration),
            appointmentType,
            reasonForVisit,
            status: 'booked',
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    7.2 Get My Appointments
// @route   GET /api/portal/appointments
// @access  Private
exports.getMyAppointments = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const { filter } = req.query; // 'upcoming' or 'past'
        let query = { patientId: patient._id };

        if (filter === 'upcoming') {
            query.appointmentDate = { $gte: new Date() };
            query.status = { $ne: 'cancelled' };
        } else if (filter === 'past') {
            query.appointmentDate = { $lt: new Date() };
        }

        const appointments = await Appointment.find(query)
            .populate('doctorId', 'name email specialization consultationHours')
            .sort({ appointmentDate: filter === 'upcoming' ? 1 : -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    7.2 Cancel Appointment (Self-Service)
// @route   PUT /api/portal/appointments/:id/cancel
// @access  Private
exports.cancelMyAppointment = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const appointment = await Appointment.findOne({ _id: req.params.id, patientId: patient._id });

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (['completed', 'in-progress', 'cancelled'].includes(appointment.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel an appointment that is already ${appointment.status}`
            });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: appointment
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    7.3 Get My Prescriptions
// @route   GET /api/portal/prescriptions
// @access  Private
exports.getMyPrescriptions = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const prescriptions = await Prescription.find({ patientId: patient._id })
            .populate('doctorId', 'name specialization email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    7.3 Download Prescription as PDF
// @route   GET /api/portal/prescriptions/:id/download
// @access  Private
exports.downloadPrescriptionPDF = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const prescription = await Prescription.findOne({ _id: req.params.id, patientId: patient._id })
            .populate('doctorId', 'name specialization email phone')
            .populate('patientId', 'firstName lastName patientId phone email gender dateOfBirth');

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Prescription-${prescription._id}.pdf"`);

        doc.pipe(res);

        // Clinic Header
        doc.fontSize(20).text('CLINIC MANAGEMENT ERP', { align: 'center' });
        doc.fontSize(10).text('Excellence in Healthcare & Patient Services', { align: 'center' });
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Doctor & Patient Info
        const doctorName = prescription.doctorId ? prescription.doctorId.name : 'Attending Physician';
        const docSpec = prescription.doctorId ? prescription.doctorId.specialization : 'General Medicine';
        const patName = `${prescription.patientId.firstName} ${prescription.patientId.lastName}`;
        const patId = prescription.patientId.patientId || 'N/A';

        doc.fontSize(12).font('Helvetica-Bold').text(`Doctor: Dr. ${doctorName} (${docSpec})`);
        doc.font('Helvetica').text(`Patient: ${patName} (ID: ${patId})`);
        doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Medications Table / List
        doc.fontSize(14).font('Helvetica-Bold').text('Prescribed Medications:');
        doc.moveDown(0.5);

        prescription.medications.forEach((med, idx) => {
            doc.fontSize(12).font('Helvetica-Bold').text(`${idx + 1}. ${med.drugName} - ${med.dosage}`);
            doc.fontSize(11).font('Helvetica').text(`   Frequency: ${med.frequency} | Duration: ${med.duration}`);
            if (med.instructions) {
                doc.text(`   Instructions: ${med.instructions}`);
            }
            doc.moveDown(0.5);
        });

        if (prescription.notes) {
            doc.moveDown();
            doc.fontSize(12).font('Helvetica-Bold').text('Doctor Notes:');
            doc.fontSize(11).font('Helvetica').text(prescription.notes);
        }

        // Footer
        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica-Oblique').text('This is a computer-generated e-Prescription. No signature required.', { align: 'center' });

        doc.end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error generating PDF' });
    }
};

// @desc    7.3 Get My Lab Orders
// @route   GET /api/portal/lab-orders
// @access  Private
exports.getMyLabOrders = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const labOrders = await LabOrder.find({ patientId: patient._id })
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: labOrders.length,
            data: labOrders
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    7.3 Download Lab Report as PDF
// @route   GET /api/portal/lab-orders/:id/download
// @access  Private
exports.downloadLabOrderPDF = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const labOrder = await LabOrder.findOne({ _id: req.params.id, patientId: patient._id })
            .populate('doctorId', 'name specialization')
            .populate('patientId', 'firstName lastName patientId gender');

        if (!labOrder) {
            return res.status(404).json({ success: false, message: 'Lab order not found' });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="LabReport-${labOrder._id}.pdf"`);

        doc.pipe(res);

        // Header
        doc.fontSize(20).text('DIAGNOSTIC LABORATORY REPORT', { align: 'center' });
        doc.fontSize(10).text('Clinic Management ERP - Laboratory Services', { align: 'center' });
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        const patName = `${labOrder.patientId.firstName} ${labOrder.patientId.lastName}`;
        doc.fontSize(12).font('Helvetica-Bold').text(`Patient: ${patName} (ID: ${labOrder.patientId.patientId})`);
        doc.font('Helvetica').text(`Ordered By: Dr. ${labOrder.doctorId ? labOrder.doctorId.name : 'Attending Physician'}`);
        doc.text(`Status: ${labOrder.status} | Date: ${new Date(labOrder.createdAt).toLocaleDateString()}`);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Tests List
        doc.fontSize(14).font('Helvetica-Bold').text('Tests Ordered:');
        doc.fontSize(12).font('Helvetica').text(labOrder.tests.join(', '));
        doc.moveDown();

        // Results
        doc.fontSize(14).font('Helvetica-Bold').text('Test Findings & Results:');
        if (labOrder.results && labOrder.results.length > 0) {
            labOrder.results.forEach((resItem, idx) => {
                doc.fontSize(12).font('Helvetica-Bold').text(`Report #${idx + 1} (${new Date(resItem.uploadedAt).toLocaleDateString()})`);
                if (resItem.notes) doc.fontSize(11).font('Helvetica').text(`Notes: ${resItem.notes}`);
                if (resItem.parsedText) {
                    doc.moveDown(0.5);
                    doc.fontSize(10).font('Courier').text(resItem.parsedText);
                }
                doc.moveDown();
            });
        } else {
            doc.fontSize(11).font('Helvetica-Oblique').text('Results are pending or no detailed text findings uploaded yet.');
        }

        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica-Oblique').text('End of Report - Verified by Clinic Diagnostic Center', { align: 'center' });

        doc.end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error generating Lab PDF' });
    }
};

// @desc    7.4 Get My Invoices
// @route   GET /api/portal/invoices
// @access  Private
exports.getMyInvoices = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const { status } = req.query;
        let query = { patientId: patient._id };

        if (status) {
            if (status === 'outstanding') {
                query['billingDetails.amountDue'] = { $gt: 0 };
                query.status = { $ne: 'Cancelled' };
            } else {
                query.status = status;
            }
        }

        const invoices = await Invoice.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    7.4 Get My Invoice By ID
// @route   GET /api/portal/invoices/:id
// @access  Private
exports.getMyInvoiceById = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const invoice = await Invoice.findOne({ _id: req.params.id, patientId: patient._id })
            .populate('patientId', 'firstName lastName patientId phone email');

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    7.4 Create Razorpay Order for Portal Invoice
// @route   POST /api/portal/invoices/:id/razorpay-order
// @access  Private
exports.createPortalRazorpayOrder = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const invoice = await Invoice.findOne({ _id: req.params.id, patientId: patient._id });

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        if (invoice.billingDetails.amountDue <= 0) {
            return res.status(400).json({ success: false, message: 'Invoice is already fully paid' });
        }

        const amountInPaise = Math.round(invoice.billingDetails.amountDue * 100);
        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: invoice.invoiceNumber
        };

        const order = await razorpay.orders.create(options);
        invoice.razorpayOrderId = order.id;
        await invoice.save();

        res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
            }
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error creating Razorpay order' });
    }
};

// @desc    7.4 Verify Online Payment for Portal Invoice
// @route   POST /api/portal/invoices/:id/verify-payment
// @access  Private
exports.verifyPortalPayment = async (req, res) => {
    try {
        const patient = await getPatientRecord(req.user);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const invoice = await Invoice.findOne({ _id: req.params.id, patientId: patient._id });

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed (Invalid signature)' });
        }

        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        const amountPaid = paymentDetails.amount / 100;

        invoice.paymentHistory.push({
            date: new Date(),
            amount: amountPaid,
            method: 'Online',
            transactionId: razorpay_payment_id,
            receiptNumber: `REC-${Date.now()}`
        });

        invoice.billingDetails.amountPaid += amountPaid;
        invoice.billingDetails.amountDue = invoice.billingDetails.grandTotal - invoice.billingDetails.amountPaid;

        if (invoice.billingDetails.amountDue <= 0) {
            invoice.status = 'Paid';
        } else {
            invoice.status = 'Partial';
        }

        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified and recorded successfully',
            data: invoice
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
    }
};
