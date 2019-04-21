const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    allergies: String,
}, {
    versionKey: false
});


Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
