const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');

let strategies = {};

const Account = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    allergies: String,
    pro_pic: String,
    provider: String
}, {
    versionKey: false
});


Account.plugin(passportLocalMongoose);

strategies.local = mongoose.model('Account', Account);

// passport google
strategies.google = passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        strategies.local.findOne({
            username: profile.id
        }, function (err, user) {
            console.log(profile);

            if (err) {
                return console.log(err);
            }
            if (!user) {
                let account = new strategies.local({
                    username: profile.id,
                    name: profile.displayName,
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

strategies.facebook = passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'emails', 'name', 'picture']
    },
    function (accessToken, refreshToken, profile, cb) {
        strategies.local.findOne({
            username: profile.id
        }, function (err, user) {
            if (err) {
                return console.log("TCL: err", err)
            }
            if (!user) {
                let account = new strategies.local({
                    username: profile.id,
                    name: profile.name.givenName + ' ' + profile.name.familyName,
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

strategies.twitter = passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    function (token, tokenSecret, profile, cb) {
        strategies.local.findOne({
            username: profile.id
        }, function (err, user) {
            // console.log(profile);
            if (err) {
                return console.log(err);
            }
            if (!user) {
                let account = new strategies.local({
                    username: profile.id,
                    name: profile.displayName,
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