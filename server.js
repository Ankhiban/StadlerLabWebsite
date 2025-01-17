const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const primerSchema = require('./models/Primer');

const app = express();

mongoose.connect('mongodb://localhost/primers_db')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.static(__dirname));

// Get all diseases/targets (collections)
app.get('/api/targets', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const targets = await Promise.all(collections.map(async collection => ({
            name: collection.name,
            count: await mongoose.connection.db.collection(collection.name).countDocuments()
        })));
        console.log('Found targets:', targets);
        res.json(targets);
    } catch (err) {
        console.error('Error fetching targets:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get primers for specific disease/target
app.get('/api/targets/:name', async (req, res) => {
    try {
        const targetName = req.params.name;
        console.log('Requested target:', targetName);
        
        // Check if collection exists first
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === targetName);
        
        if (!collectionExists) {
            return res.status(404).json({ error: 'Target collection not found' });
        }
        
        // Use direct collection access instead of model to prevent automatic collection creation
        const primers = await mongoose.connection.db.collection(targetName).find({}).toArray();
        console.log(`Found ${primers.length} primers for ${targetName}`);
        
        res.json(primers);
    } catch (err) {
        console.error('Error fetching primers:', err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});