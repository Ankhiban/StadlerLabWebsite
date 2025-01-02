const mongoose = require('mongoose');

const primerSchema = new mongoose.Schema({
    name: String,
    reference: String,
    type: String,
    forwardPrimer: String,
    forwardPrimerLength: Number,
    reversePrimer: String,
    reversePrimerLength: Number,
    probe: String,
    probeLength: Number,
    notes: String
});

module.exports = primerSchema;