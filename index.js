const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))

let listItem = {};

app.get('/', (req, res) => {
    console.log(listItem);
    res.render('index', {
        item: listItem,
    });
})

app.post('/', (req, res) => {
    console.log(req.body);
    let addItem = req.body.newItem;
    let removeItem = req.body.removeItem;
    let operation = req.body.operation;
    if (addItem && operation) {
        listItem[addItem] = 1;
    }
    if (removeItem && !operation) {
        if (typeof removeItem === 'string') {
            delete listItem[removeItem];
        } else {
            removeItem.forEach(element => {
                delete listItem[element];
            });
        }
    }
    res.redirect('/');
})

app.listen(3000, () => console.log('starting'));