const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Target = require('./models/Target');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/primers_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to MongoDB.');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());

// API Routes - Put these BEFORE the static file middleware
app.get('/api/targets', async (req, res) => {
  try {
    const targets = await Target.find({});
    console.log('Found targets:', targets);
    res.json(targets);
  } catch (err) {
    console.error('Error fetching targets:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/targets/:name', async (req, res) => {
  try {
    const target = await Target.findOne({ name: req.params.name });
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }
    res.json(target);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Static file middleware - Put this AFTER the API routes
app.use(express.static(__dirname));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`  http://localhost:${PORT}/api/targets`);
});