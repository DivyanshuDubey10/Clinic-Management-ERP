const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
// CORS allows our frontend to make requests to this backend API
app.use(cors());
// express.json() parses incoming JSON payloads in the request body
app.use(express.json());

// Basic health-check route to verify the server is running
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Clinic ERP API is running smoothly.'
    });
});

// We will add more routes here later (e.g., auth, patients, appointments)

module.exports = app;
