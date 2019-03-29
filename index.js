const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('we\'re connected!', db.port));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const Schema = mongoose.Schema;

let listItem = {};

let food = mongoose.model('food', Schema({
    food: String
}));



app.get('/', (req, res) => {
    food.find(function (err, docs) {
        console.log(docs[0].food);
    })
    res.render('index', {
        // food.find(function (err, docs) {
        //     item: docs
        //     console.log(docs[0].food);
        // })
    });
})



app.post('/', (req, res) => {
    let addItem = req.body.newItem;
    let removeItem = req.body.removeItem;
    let operation = req.body.operation;
    if (addItem && operation) {
        let item = new food({
            food: addItem
        });
        // item.save();
    }
    if (removeItem && !operation) {
        typeof removeItem === 'string' ? delete listItem[removeItem] :
            removeItem.forEach(element => {
                delete listItem[element];
            });
    }
    res.redirect('/');
})

app.listen(3000, () => console.log('starting'));