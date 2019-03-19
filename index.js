const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))

let listItem = [];

app.get('/', (req, res) => {
    res.render('index', {
        item: listItem,
    });
})

app.post('/', (req, res) => {
    console.log(req.body);
    listItem.push(req.body.newItem);
    res.redirect('/');
})

app.listen(3000, () => console.log('starting'));