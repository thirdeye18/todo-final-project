//index.js
const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const bodyParser= require('body-parser');
//for storing values in .env file and retrieving them
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://thirdeye18:${process.env.MONGO_PW}@cluster0.opwsp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to the Database. Mongo likes Candy.');
    //variables for database name and collection
    const db = client.db('todo-list');
    const destinations = db.collection('items');

    //make sure urlencoded before CRUD handelers
    router.use(bodyParser.urlencoded({ extended: true }));

    router.get('/', (req, res) => {
      items.find().toArray()
      .then(results => {
        console.log({items: results});
        res.render('index', {
        index: results,
        isAuthenticated: req.oidc.isAuthenticated()
        })
      })
      .catch(err => console.log(err))
    })

    //adding items to the list
    router.post('/addItem', (req, res) => {
      destinations.insertOne(req.body)
      .then(result => {
        res.redirect('/')
      })
      .catch(err => console.error(err))
    })
  })
  //catching promise error for MongoClient connect
  .catch(error => { console.error(error) })

module.exports = router;