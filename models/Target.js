const mongoose = require('mongoose');

const assaySchema = new mongoose.Schema({
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

const targetSchema = new mongoose.Schema({
  name: String,
  assays: [assaySchema]
});


module.exports = mongoose.model('Target', targetSchema);

