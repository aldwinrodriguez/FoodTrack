const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

let strategies = {};

const Schemas = mongoose.Schema;

// google model
let googleUser = mongoose.model('google', Schemas({
    _id: String,
    name: String,
    f_name: String,
    email: String,
    pro_pic: String,
    provider: String
}, {
    versionKey: false
}))

// passport google
strategies.google = passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        googleUser.findById({
            _id: profile.id
        }, function (err, user) {
            console.log(profile);
            
            if (err) {
                return console.log(err);
            }
            if (!user) {
                let account = new googleUser({
                    _id: profile.id,
                    name: profile.displayName,
                    f_name: profile.name.givenName,
                    email: profile.emails[0].value,
                    // update
                    pro_pic: profile.photos[0].value,
                    provider: profile.provider
                });
                account.save(err => {
                    if (err) return console.log(err);
                });
                return cb(err, user);
            }
            return cb(err, user);
        });
    }
));

module.exports = strategies;