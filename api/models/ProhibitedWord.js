const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const ProhibitedWordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ProhibitedWord', ProhibitedWordSchema);