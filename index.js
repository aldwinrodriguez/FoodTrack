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
    saveUninitialized: true,
    cookie: {
        secure: true
    }
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

const Schema = mongoose.Schema;

// food collections
let food = mongoose.model('food', Schema({
    food: String,
    hour: Number,
    day: String,
    dayNum: Number
}, {
    versionKey: false
}));



// Passport
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Routes
app.get('/login',
    //   passport.authenticate('local', { failureRedirect: '/' }),
    function (req, res) {
        res.render('login');
    });

app.get('/',
    function (req, res) {
        res.render('login');
    });

app.get('/failedlogin', (req,res) => {
    res.send('you are not registered yet')
})

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/',
    passport.authenticate('local', {
        failureRedirect: '/failedlogin'
    }),
    function (req, res) {
        res.send('success');
    });

app.post('/register', function (req, res) {
    Account.register(new Account({
        username: req.body.username
    }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {
                account: account
            });
        }

        passport.authenticate('local')(req, res, function () {
            console.log(req.user);

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