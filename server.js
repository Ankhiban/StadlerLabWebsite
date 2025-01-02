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
        const TargetModel = mongoose.model(targetName, primerSchema, targetName);
        const primers = await TargetModel.find({});
        
        // Calculate lengths for each primer if they're missing
        const primersWithLengths = primers.map(primer => {
            const doc = primer.toObject();
            if (!doc.forwardPrimerLength) {
                doc.forwardPrimerLength = doc.forwardPrimer ? doc.forwardPrimer.length : 0;
            }
            if (!doc.reversePrimerLength) {
                doc.reversePrimerLength = doc.reversePrimer ? doc.reversePrimer.length : 0;
            }
            if (!doc.probeLength) {
                doc.probeLength = doc.probe ? doc.probe.length : 0;
            }
            return doc;
        });
        
        res.json(primersWithLengths);
    } catch (err) {
        console.error('Error fetching primers:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add new primer to a disease/target
app.post('/api/targets/:name', async (req, res) => {
    try {
        const targetName = req.params.name;
        const TargetModel = mongoose.model(targetName, primerSchema, targetName);
        
        // Calculate lengths before saving
        const primerData = {
            ...req.body,
            forwardPrimerLength: req.body.forwardPrimer ? req.body.forwardPrimer.length : 0,
            reversePrimerLength: req.body.reversePrimer ? req.body.reversePrimer.length : 0,
            probeLength: req.body.probe ? req.body.probe.length : 0
        };
        
        const primer = new TargetModel(primerData);
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