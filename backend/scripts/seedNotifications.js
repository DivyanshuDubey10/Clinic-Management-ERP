require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

async function seedNotifications() {
  await connectDB();
  
  // Find a patient or admin user (Akash Dubey)
  const user = await User.findOne({ email: 'akashdubey@gmail.com' });
  
  if (!user) {
    console.log("Test user not found");
    process.exit(1);
  }

  // Clear old notifications
  await Notification.deleteMany({ user: user._id });

  const dummyNotifications = [
    {
      user: user._id,
      title: 'Welcome to Clinic ERP!',
      message: 'Your account has been created successfully. We are glad to have you.',
      type: 'success',
    },
    {
      user: user._id,
      title: 'Profile Incomplete',
      message: 'Please complete your profile details in the settings page.',
      type: 'warning',
      link: '/settings/profile'
    },
    {
      user: user._id,
      title: 'Upcoming Appointment Reminder',
      message: 'You have an appointment tomorrow at 10:00 AM with Dr. Smith.',
      type: 'info',
      link: '/appointments'
    }
  ];

  await Notification.insertMany(dummyNotifications);
  console.log("Notifications seeded successfully for", user.name);
  process.exit(0);
}

seedNotifications();
