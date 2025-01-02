const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const primerSchema = require('./models/Primer');

const app = express();

mongoose.connect('mongodb://localhost/primers_db');

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
        // Check if model already exists to prevent OverwriteModelError
        const TargetModel = mongoose.models[targetName] || mongoose.model(targetName, primerSchema);
        const primers = await TargetModel.find({});
        res.json(primers);
    } catch (err) {
        console.error('Error fetching primers:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add new primer to a disease/target
app.post('/api/targets/:name', async (req, res) => {
    try {
        const targetName = req.params.name;
        // Check if model already exists to prevent OverwriteModelError
        const TargetModel = mongoose.models[targetName] || mongoose.model(targetName, primerSchema);
        const primer = new TargetModel(req.body);
        await primer.save();
        res.status(201).json(primer);
    } catch (err) {
        console.error('Error adding primer:', err);
        res.status(400).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});