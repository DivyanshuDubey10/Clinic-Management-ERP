require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        // Connect to database
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Define default admin credentials
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@clinic.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

        // Check if admin already exists
        const adminExists = await User.findOne({ email: adminEmail });
        if (adminExists) {
            console.log(`Admin user ${adminEmail} already exists! No need to seed.`);
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            name: 'System Administrator',
            email: adminEmail,
            password: adminPassword,
            phone: '0000000000',
            role: 'admin'
        });

        console.log(`Admin user seeded successfully!`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error(`Error seeding admin: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
