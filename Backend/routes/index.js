const router = require('express').Router();
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
    const items = db.collection('items');

    //make sure urlencoded before CRUD handelers
    router.use(bodyParser.urlencoded({ extended: true }));

    router.get('/', (req, res) => {
      //res.send(__dirname)
      res.sendFile('/mnt/d/Amazon SDE/2_HTML_CSS/todo-final-project/Frontend/welcome-page.html')
    })

    router.post('addItem', (req, res) => {
      items.insertOne (req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    router.get('/', (req, res) => {
      items.find().toArray()
        .then(results => {
          console.log(results);
        })
      .catch(error => console.error(error))
    })

  })

  //catching promise error for MongoClient connect
  .catch(error => { console.error(error) });

module.exports = router;
