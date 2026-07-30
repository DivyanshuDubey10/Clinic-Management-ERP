const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Middlewares
app.use(helmet());

// Rate Limiting (Max 200 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Middlewares
// CORS allows our frontend to make requests to this backend API
app.use(cors({
    origin: true,
    credentials: true
}));
// express.json() parses incoming JSON payloads in the request body
app.use(express.json());

// Cookie parser middleware for reading refresh tokens
app.use(cookieParser());

// Basic health-check route to verify the server is running
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Clinic ERP API is running smoothly.'
    });
});

// Route imports
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const staffRoutes = require('./routes/staffRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const billingRoutes = require('./routes/billingRoutes');
const patientPortalRoutes = require('./routes/patientPortalRoutes');
const reportingRoutes = require('./routes/reportingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const labOrderRoutes = require('./routes/labOrderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/portal', patientPortalRoutes);
app.use('/api/reports', reportingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab-orders', labOrderRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack || err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;


