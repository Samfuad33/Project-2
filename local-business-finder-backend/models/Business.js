
const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    description: { type: String },
});

module.exports = mongoose.model('Business', BusinessSchema);
