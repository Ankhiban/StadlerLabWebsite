const mongoose = require('mongoose');

const primerSchema = new mongoose.Schema({
    name: String,
    reference: String,
    type: String,
    forwardPrimer: String,
    forwardPrimerLength: {
        type: Number,
        set: function(v) {
            // Length will be automatically calculated from forwardPrimer
            return this.forwardPrimer ? this.forwardPrimer.length : 0;
        }
    },
    reversePrimer: String,
    reversePrimerLength: {
        type: Number,
        set: function(v) {
            // Length will be automatically calculated from reversePrimer
            return this.reversePrimer ? this.reversePrimer.length : 0;
        }
    },
    probe: String,
    probeLength: {
        type: Number,
        set: function(v) {
            // Length will be automatically calculated from probe
            return this.probe ? this.probe.length : 0;
        }
    },
    notes: String
});

// Pre-save middleware to ensure lengths are calculated before saving
primerSchema.pre('save', function(next) {
    if (this.forwardPrimer) {
        this.forwardPrimerLength = this.forwardPrimer.length;
    }
    if (this.reversePrimer) {
        this.reversePrimerLength = this.reversePrimer.length;
    }
    if (this.probe) {
        this.probeLength = this.probe.length;
    }
    next();
});

module.exports = primerSchema;