const express = require('express')
var bodyParser = require('body-parser');
const db = require('./db');

const app = express()
const port = 3000

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extend: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.get('/', async function (req, res) {
    res.render('./views/display.html');
});

app.get('/data', async function (req, res) {
    var data = await db.getData()
    res.json(data)
})

app.listen(port, () => console.log(`Example app started`))
