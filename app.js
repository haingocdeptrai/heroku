const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/insert', (req, res) => {
    res.render('insert');
})

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://haingocdeptrai:haingocdeptrai@cluster0.3ndgf.mongodb.net/shope";


app.post('/addProduct', async(req, res) => {
    let inputName = req.body.product;
    let inputPrice = req.body.price;
    let color = req.body.color;
    let newProduct = { name: inputName, price: inputPrice };

    let client = await MongoClient.connect(url);
    let dbo = client.db("shope");
    await dbo.collection("product").insertOne(newProduct);
    res.redirect('/'); //
})
app.post('/update', async(req, res) => {
    let id = req.body.id;
    var ObjectID = require('mongodb').ObjectID;
    let inputName = req.body.product;
    let inputPrice = req.body.price;
    let edit = { name: inputName, price: inputPrice };

    let client = await MongoClient.connect(url);
    let dbo = client.db("shope");
    await dbo.collection("product").updateOne({ _id: ObjectID(id) }, {
        $set: edit
    });
    res.redirect('/'); //
})

app.post('/creatProduct', async(req, res) => {
    let inputName = req.body.productName;
    let inputPrice = req.body.price;
    let newProduct = { name: inputName, price: inputPrice };

    let client = await MongoClient.connect(url);
    let dbo = client.db("shope");
    await dbo.collection("product").insertOne(newProduct);
    res.redirect('/'); //
})

//localhost:3000
app.get('/', async function(req, res) {
    let client = await MongoClient.connect(url);
    let dbo = client.db("shope");
    let result = await dbo.collection("product").find({}).toArray();
    res.render('index', { model: result });
})

app.get('/search', async function(req, res) {
    let name = req.query.name;
    let client = await MongoClient.connect(url);
    let dbo = client.db("shope");
    let result = await dbo.collection("product").find({ name: name }).toArray();
    res.render('index', { model: result });
})

app.get('/remove', async(req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("shope");
    await dbo.collection("product").deleteOne({ _id: ObjectID(id) });
    res.redirect('/');

})
app.get('/updateProduct', async function(req, res) {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("shope");
    let result = await dbo.collection("product").findOne({ _id: ObjectID(id) })
    console.log(result)
    res.render('updateProduct', { model: result });
})


const PORT = process.env.PORT || 3000;
app.listen(PORT);