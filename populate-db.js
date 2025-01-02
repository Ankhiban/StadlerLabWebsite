const mongoose = require('mongoose');
const Target = require('./models/Target');

const sampleData = {
  name: 'Influenza',
  assays: [
    {
      name: 'AssayName',
      reference: 'Reference',
      type: 'qPCR',
      forwardPrimer: 'AGTCAGTC',
      forwardPrimerLength: 8,
      reversePrimer: 'AGTCAGTC',
      reversePrimerLength: 8,
      probe: 'AGTCAGTC',
      probeLength: 8,
      notes: 'Other Info!!'
    }
  ]
};

async function populateDB() {
  try {
    await mongoose.connect('mongodb://localhost/primers_db');
    await Target.create(sampleData);
    console.log('Database populated!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error populating database:', err);
  }
}

populateDB();