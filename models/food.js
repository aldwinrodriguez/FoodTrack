const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
    food: String,
    hour: Number,
    day: String,
    dayNum: Number
}, {
    versionKey: false
});

module.exports = mongoose.model('Food', foodSchema);