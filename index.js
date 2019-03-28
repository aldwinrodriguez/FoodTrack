const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/testing', {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('we\'re connected!', db.port));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))

let listItem = {};

let exampleSchema = new mongoose.Schema({
    name: String,
    age: Number
});

let example = mongoose.model('example', exampleSchema);
let de = new example({name: 'de', age: 21});
    
de.save();



app.get('/', (req, res) => {
    res.render('index', {
        item: listItem,
    });
})

app.post('/', (req, res) => {
    let addItem = req.body.newItem;
    let removeItem = req.body.removeItem;
    let operation = req.body.operation;
    if (addItem && operation) listItem[addItem] = 1;
    if (removeItem && !operation) {
        typeof removeItem === 'string' ? delete listItem[removeItem] :
            removeItem.forEach(element => {
                delete listItem[element];
            });
    }
    res.redirect('/');
})

app.listen(3000, () => console.log('starting'));