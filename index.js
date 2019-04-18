require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

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

// Passport
const Account = require(__dirname + '/models/account.js');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

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