const mongoose = require('mongoose');

// Helper function to calculate GC content
function calculateGCContent(sequence) {
    if (!sequence) return 0;
    const gc = (sequence.match(/[GC]/gi) || []).length;
    const total = sequence.length;
    return total > 0 ? (gc / total * 100).toFixed(1) : 0;
}

const primerSchema = new mongoose.Schema({
    name: String,
    reference: String,
    type: String,
    detectionMethod: {
        type: String,
        enum: ['qpcr', 'ddpcr'],
        required: true,
        lowercase: true
    },
    forwardPrimer: String,
    forwardPrimerLength: Number,
    forwardPrimerGC: Number,
    reversePrimer: String,
    reversePrimerLength: Number,
    reversePrimerGC: Number,
    probe: String,
    probeLength: Number,
    probeGC: Number,
    cdcRecommended: {
        type: Boolean,
        default: false
    },
    notes: String
});

// Pre-save middleware to calculate lengths and GC content
primerSchema.pre('save', function(next) {
    if (this.forwardPrimer) {
        this.forwardPrimerLength = this.forwardPrimer.length;
        this.forwardPrimerGC = calculateGCContent(this.forwardPrimer);
    }
    if (this.reversePrimer) {
        this.reversePrimerLength = this.reversePrimer.length;
        this.reversePrimerGC = calculateGCContent(this.reversePrimer);
    }
    if (this.probe) {
        this.probeLength = this.probe.length;
        this.probeGC = calculateGCContent(this.probe);
    }
    next();
});

module.exports = primerSchema;