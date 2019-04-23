require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const myFunc = require(__dirname + '/ex/time.js');

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

const account = require(__dirname + '/models/accounts.js');

// home
app.route('/')
    .get(routeCb.home)
    .post((req, res) => {
        let addItem = req.body.newItem;
        console.log("TCL: addItem", addItem)
        let removeItem = req.body.removeItem;
        let operation = req.body.operation;

        if (addItem && (operation === 'true')) {
            account.findOneAndUpdate({
                username: req.user.username
            }, {
                $push: {
                    food_ate: {
                        food_name: myFunc.caps(addItem),
                        hour: myFunc.getHour(),
                        day: myFunc.getDay(),
                        dayNum: myFunc.getDayNum(),
                        day_of_month: myFunc.getDayOfMonth(),
                        month: myFunc.getMonth(),
                    }
                }
            }, (err, user) => {
                return (err ? err : user);
            });
            // let item = new food({
            //     food: timeAndCaps.caps(addItem),
            //     hour: timeAndCaps.getHour(),
            //     day: timeAndCaps.getDay(),
            //     dayNum: timeAndCaps.getDayNum()
            // });
            // item.save();
        }
        console.log("TCL: removeItem", removeItem)
        if (((typeof removeItem) === 'object') && (operation === 'false')) {
            account.findOneAndUpdate({
                username: req.user.username
            }, {
                $pull: {
                    food_ate: {
                        food_name: {
                            $in: removeItem
                        }
                    }
                }
            }, (err, docs) => {
                return (err ? err : docs);
            });
            // food.deleteMany({
            //     food: {
            //         $in: removeItem
            //     }
            // }, (err, docs) => console.log(docs));
        } else if (((typeof removeItem) === 'string') && (operation === 'false')) {
            account.findOneAndUpdate({
                username: req.user.username
            }, {
                $pull: {
                    food_ate: {
                        food_name: removeItem
                    }
                }
            }, (err, docs) => {
                return (err ? err : docs);
            });
        }
        res.redirect('/');
    });

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