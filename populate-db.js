const mongoose = require('mongoose');
const primerSchema = require('./models/Primer');

async function populateDB() {
    try {
        await mongoose.connect('mongodb://localhost/primers_db');
        console.log('Connected to MongoDB');

        // Sample diseases and their primers
        const diseases = ['Influenza', 'Measles', 'Norovirus'];
        
        for (const disease of diseases) {
            const DiseaseModel = mongoose.model(disease, primerSchema, disease);
            
            // Sample primers for each disease
            const samplePrimer = {
                name: 'AssayName',
                reference: 'Reference',
                type: 'qPCR',
                forwardPrimer: 'AGTCAGTC',
                forwardPrimerLength: 8,
                reversePrimer: 'AGTCAGTC',
                reversePrimerLength: 8,
                probe: 'AGTCAGTC',
                probeLength: 8,
                notes: `Sample primer for ${disease}`
            };

            // Add a second primer for variety
            const samplePrimer2 = {
                name: 'AssayName2',
                reference: 'Reference2',
                type: 'qPCR',
                forwardPrimer: 'TACGTACG',
                forwardPrimerLength: 8,
                reversePrimer: 'TACGTACG',
                reversePrimerLength: 8,
                probe: 'TACGTACG',
                probeLength: 8,
                notes: `Another primer for ${disease}`
            };

            await DiseaseModel.create([samplePrimer, samplePrimer2]);
            console.log(`Added sample data to ${disease} collection`);
        }

        console.log('Database populated successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error populating database:', err);
    }
}

populateDB();