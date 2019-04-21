require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
// const passportLocalMongoose = require('passport-local-mongoose');


// my exports
const timeAndCaps = require(__dirname + '/ex/time.js');

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
mongoose.connect('mongodb://localhost:27017/FoodTrack', {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('we\'re connected!', db.port));






app.get('/auth/facebook',
    passport.authenticate('facebook', {
        scope: ['email']
    }));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/auth/facebook'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });




app.get('/auth/twitter',
    passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        failureRedirect: '/auth/twitter'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

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

// home
app.route('/')
    .get(routeCb.home);

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

// google
app.get('/auth/google', auth.google);
app.get('/auth/google/callback', auth.googleCb, (req, res) => res.redirect('/'));

// temp
app.get('/policy', (req, res) => {
    res.send('Privacy Policy of FoodTrack FoodTrack operates the FoodTrack website, which provides the SERVICE. This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the FoodTrack. If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy. The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at localhost:3000, unless otherwise defined in this Privacy Policy.')
})

// app.route('/')
//     .get((req, res) => {
//         food.find(function (err, docs) {
//             res.render('index', {
//                 item: docs,
//             });
//         })
//     })
//     .post((req, res) => {
//         let addItem = req.body.newItem;
//         let removeItem = req.body.removeItem;
//         let operation = req.body.operation;
//         if (addItem && (operation === 'true')) {
//             let item = new food({
//                 food: timeAndCaps.caps(addItem),
//                 hour: timeAndCaps.getHour(),
//                 day: timeAndCaps.getDay(),
//                 dayNum: timeAndCaps.getDayNum()
//             });
//             item.save();
//         }
//         if (removeItem && (operation === 'false')) {
//             food.deleteMany({
//                 food: {
//                     $in: removeItem
//                 }
//             }, (err, docs) => console.log(docs));
//         }
//         res.redirect('/');
//     });


app.listen(3000, () => console.log('starting'));