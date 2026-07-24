const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

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

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
module.exports = app;
