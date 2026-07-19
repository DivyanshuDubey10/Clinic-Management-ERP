const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // We use process.env.MONGO_URI which comes from the .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure code if database connection fails
        process.exit(1);
    }
};

module.exports = connectDB;
