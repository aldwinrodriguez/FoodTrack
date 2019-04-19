const passport = require('passport');

let oauth = {};

// google
oauth.google = passport.authenticate('google', {
    scope: ['profile', 'email', 'openid']
})
oauth.googleCb = passport.authenticate('google', {
    failureRedirect: '/'
})

module.exports = oauth;