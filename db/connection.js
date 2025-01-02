// connection.js
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const connectToAtlas = async (app) => {
    try {
        // Apply security middleware
        app.use(helmet());
        app.use(mongoSanitize());

        // Connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            tlsAllowInvalidCertificates: false, // Enforce valid certificates
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        // Connect using environment variables
        await mongoose.connect(process.env.MONGODB_URI, options);
        
        console.log('Successfully connected to MongoDB Atlas');
        
        // Set up connection error handlers
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectToAtlas;