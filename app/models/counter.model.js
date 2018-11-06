const mongoose = require('mongoose');

const CounterSchema = mongoose.Schema({
    _id: String,
    seq: Number
});

module.exports = mongoose.model('Counter', CounterSchema);