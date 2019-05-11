const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    allergies: String,
    pro_pic: String,
    provider: String,
    food_ate: Array,
    reacted: Array,
}, {
    versionKey: false
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('account', Account);