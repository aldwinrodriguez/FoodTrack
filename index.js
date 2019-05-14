require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();
// app configurations
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.set('useCreateIndex', true);

// mongoDB config
// let connection = 'mongodb+srv://aldwin:'+process.env.MONGOUSER1+'@foodtrack-scwic.mongodb.net/test?retryWrites=true'
// mongoose.connect(connection, {
//     useNewUrlParser: true
// });

mongoose.connect(process.env.CONNECTION, {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('we\'re connected!', db.port));

// import Strategies
const Strategy = require(__dirname + '/models/strategies_oauth.js');
// Local Strategy
passport.use(new LocalStrategy(Strategy.local.authenticate()));
// Strategies
Strategy.google;
Strategy.facebook;
Strategy.twitter;

// serialize and deserialize
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
const routeCb = require(__dirname + '/route_cbs/route_callbacks.js');

app.post('/react', (req, res) => {
    res.send(req.body.items[2]);
})

// home
app.route('/')
    .get(routeCb.home)
    .post(routeCb.postHome);

// login
app.route('/login')
    .get(routeCb.login)
    .post(routeCb.postLogin);

// register
app.route('/register')
    .get(routeCb.register)
    .post(routeCb.postRegister);

// logout
app.get('/logout', routeCb.logout);

// oauths
const auth = require(__dirname + '/route_cbs/authenticate.js');

// google request
app.get('/auth/google', auth.google);
app.get('/auth/google/callback', auth.googleCb, (req, res) => res.redirect('/'));

// facebook request
app.get('/auth/facebook', auth.facebook);
app.get('/auth/facebook/callback', auth.facebookCb, (req, res) => res.redirect('/'));

// twitter request
app.get('/auth/twitter', auth.twitter);
app.get('/auth/twitter/callback', auth.twitterCb, (req, res) => res.redirect('/'));

// temporary policy
app.get('/policy', routeCb.policy);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port);