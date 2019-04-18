const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    allergies: String,
}, {
    versionKey: false
});

let options = {
    errorMessages: {
        IncorrectPasswordError: true
    }
};


Account.plugin(passportLocalMongoose, options);

module.exports = mongoose.model('Account', Account);
