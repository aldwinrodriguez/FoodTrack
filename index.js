require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// my exports
const timeAndCaps = require(__dirname + '/ex/time.js');

// app configurations
const app = express();

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
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('we\'re connected!', db.port));

// food collections
const food = require(__dirname + '/models/food.js');

// Passport
const Account = require(__dirname + '/models/account.js');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Routes
app.get('/', (req, res) => {
    let user = req.user;
    console.log(user);
    if (user) {
        food.find(function (err, docs) {
            res.render('home', {
                item: docs,
            });
        })
    } else {
        res.redirect('/login');
    }
})

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/login',
    function (req, res) {
        res.render('login');
    });

app.post('/login',
    passport.authenticate('local'),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // res.redirect('/users/' + req.user.username);
        res.redirect('/');
    });

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', function (req, res) {
    Account.register(new Account({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        allergies: req.body.allergies,
    }), req.body.password, function (err, account) {

        if (err) {
            return res.render('register', {
                account: account
            });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

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