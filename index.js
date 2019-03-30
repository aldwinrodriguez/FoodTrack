const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost/test', {
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

let listItems;

let currentTime = new Date();
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let currentHour = currentTime.getHours();
let currentDayNum = currentTime.getDay();
let currentDay = days[currentDayNum];


app.get('/', (req, res) => {
    food.find(function (err, docs) {
        listItems = docs;
        res.render('index', {
            item: docs,
        });
    })
})

app.post('/', (req, res) => {
    let addItem = req.body.newItem;
    let removeItem = req.body.removeItem;
    let operation = req.body.operation;
    for (let i = 0; i < listItems.length; i++) {
        if (addItem === listItems[i].food) {
            return res.redirect('/')
        }
    }
    if (addItem && (operation === 'true')) {
        let item = new food({
            food: addItem,
            hour: currentHour,
            day: currentDay,
            dayNum: currentDayNum
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
})

app.listen(3000, () => console.log('starting'));