// app.js
const express = require('express');
const connectDB = require('./config/database');
const apiKeyAuth = require('./middleware/auth');
const app = express();

// Security headers
app.disable('x-powered-by');

// Request logging for security monitoring
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Apply authentication to all routes
app.use('/api', apiKeyAuth);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal server error',
        requestId: req.id // For tracking issues
    });
});