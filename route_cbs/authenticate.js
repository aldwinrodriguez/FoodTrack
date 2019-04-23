const passport = require('passport');

let oauth = {};

// google
oauth.google = passport.authenticate('google', {
    scope: ['profile', 'email', 'openid']
});
oauth.googleCb = passport.authenticate('google', {
    failureRedirect: '/auth/google'
});

oauth.facebook = passport.authenticate('facebook', {
    scope: ['email']
});
oauth.facebookCb = passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook'
});

oauth.twitter = passport.authenticate('twitter');
oauth.twitterCb = passport.authenticate('twitter', {
    failureRedirect: '/auth/twitter'
});

module.exports = oauth;