const mongoose = require('mongoose');

const RefreshSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: true
    }
}, {collection: 'refresh_tokens', timestamps: true});

module.exports = mongoose.model('Refresh', RefreshSchema);