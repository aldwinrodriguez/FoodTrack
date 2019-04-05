const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const timeAndCaps = require(__dirname + '/ex/time.js');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('we\'re connected!', db.port));

const Schema = mongoose.Schema;

let food = mongoose.model('food', Schema({
    food: String,
    hour: Number,
    day: String,
    dayNum: Number
}, {
    versionKey: false
}));

app.route('/')
    .get((req, res) => {
        food.find(function (err, docs) {
            res.render('index', {
                item: docs,
            });
        })
    })
    .post((req, res) => {
        let addItem = req.body.newItem;
        let removeItem = req.body.removeItem;
        let operation = req.body.operation;
        if (addItem && (operation === 'true')) {
            let item = new food({
                food: timeAndCaps.caps(addItem),
                hour: timeAndCaps.getHour(),
                day: timeAndCaps.getDay(),
                dayNum: timeAndCaps.getDayNum()
            });
            item.save();
        }
        if (removeItem && (operation === 'false')) {
            food.deleteMany({
                food: {
                    $in: removeItem
                }
            }, (err, docs) => console.log(docs));
        }
        res.redirect('/');
    });


app.listen(3000, () => console.log('starting'));