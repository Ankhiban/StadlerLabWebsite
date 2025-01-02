const mongoose = require('mongoose');
const primerSchema = require('./models/Primer');

async function populateDB() {
    try {
        await mongoose.connect('mongodb://localhost/primers_db');
        console.log('Connected to MongoDB');

        // Clear existing collections first
        const collections = await mongoose.connection.db.listCollections().toArray();
        for (const collection of collections) {
            await mongoose.connection.db.dropCollection(collection.name);
        }
        console.log('Cleared existing collections');

        const diseases = [
            'Influenza',
            'COVID19',
            'RSV',
            'Measles',
            'Norovirus',
            'Adenovirus',
            'Enterovirus',
            'Rotavirus',
            'Hepatitis',
            'Tuberculosis'
        ];

        // Template for creating varied primers
        const createPrimer = (name, method, cdcRec, ref) => ({
            name: name,
            reference: ref,
            type: method.toUpperCase(),
            detectionMethod: method,
            forwardPrimer: 'ATCG'.repeat(5 + Math.floor(Math.random() * 5)),
            reversePrimer: 'GCTA'.repeat(5 + Math.floor(Math.random() * 5)),
            probe: 'TGCA'.repeat(4 + Math.floor(Math.random() * 4)),
            cdcRecommended: cdcRec,
            notes: `${name} primer for detection using ${method.toUpperCase()}`
        });

        for (const disease of diseases) {
            const DiseaseModel = mongoose.model(disease, primerSchema, disease);
            
            // Create multiple primers for each disease with different properties
            const primers = [
                // CDC Recommended primers
                createPrimer(
                    `${disease} CDC Primary`, 
                    'qpcr', 
                    true,
                    'CDC Guidelines 2024'
                ),
                createPrimer(
                    `${disease} CDC Alternative`, 
                    'ddpcr', 
                    true,
                    'CDC Alternative Protocol 2024'
                ),
                
                // Non-CDC primers
                createPrimer(
                    `${disease} Research Protocol 1`, 
                    'qpcr', 
                    false,
                    'Journal of Virology, 2023'
                ),
                createPrimer(
                    `${disease} Clinical Protocol`, 
                    'ddpcr', 
                    false,
                    'Clinical Microbiology Reviews, 2024'
                )
            ];

            // Add some disease-specific primers
            if (disease === 'COVID19') {
                primers.push(
                    createPrimer(
                        'SARS-CoV-2 N1', 
                        'qpcr', 
                        true,
                        'CDC COVID-19 Protocol v5'
                    ),
                    createPrimer(
                        'SARS-CoV-2 N2', 
                        'qpcr', 
                        true,
                        'CDC COVID-19 Protocol v5'
                    )
                );
            }

            if (disease === 'Influenza') {
                primers.push(
                    createPrimer(
                        'Influenza A H1N1', 
                        'qpcr', 
                        true,
                        'WHO Influenza Protocol 2024'
                    ),
                    createPrimer(
                        'Influenza B Universal', 
                        'ddpcr', 
                        false,
                        'European CDC Protocol'
                    )
                );
            }

            await DiseaseModel.create(primers);
            console.log(`Added ${primers.length} primers to ${disease} collection`);
        }

        console.log('Database populated successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error populating database:', err);
        process.exit(1);
    }
}

populateDB();