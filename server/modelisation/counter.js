// models/Counter.js
const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: String,
    sequence: Number
});

const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;