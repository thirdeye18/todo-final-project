const router = require('express').Router();
const bodyParser= require('body-parser');
//for storing values in .env file and retrieving them
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

const {MongoClient, ObjectId} = require('mongodb');
const uri = `mongodb+srv://thirdeye18:${process.env.MONGO_PW}@cluster0.opwsp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to the Database. Mongo likes Candy.');
    //variables for database name and collection
    const db = client.db('todo-list');
    const items = db.collection('items');

    // ========================
    // Midleware
    // ========================

    //make sure urlencoded before CRUD handelers
    router.use(bodyParser.urlencoded({ extended: true }));

    // ========================
    // Routes
    // ========================

    router.get('/todo', async (req, res) => {
      const complete = req.query.complete;
      const data = await items.find({complete: complete}).toArray();
      res.send(data);
    })

    router.post('/todo', async(req, res) => {
      const {itemName, dueDate, complete} = req.body

      if(!itemName || name.length === 0 || !complete || complete.length ===0) {
        return res.status(400).json({message: "Need name and complete status!"})
      }

      const item = {itemName, complete};

      if(dueDate && dueDate.length !== 0) {
        item.dueDate = dueDate;
      }else {
        item.dueDate = "No date selected";
      }

      items.insertOne(item)
        .then(value => {
          res.redirect(303, '/todo?complete=false')
        })
        .catch(error => console.error(error))
    })

    router.put('/todo', async(req, res) => {
      const{_id, itemName, dueDate, complete} = req.body;
      const newItem = {};
      if(itemName && name.length !== 0) {
        newItem.name = itemName;
      }
      if(dueDate && dueDate.length !== 0) {
        newItem.dueDate = dueDate;
      }
      if(complete && complete.length !== 0) {
        newItem.complete = complete;
      }
      items.updateOne({_id: ObjectId(_id)}, {$set: newItem})
        .then(() => {
          res.redirect(303, '/todo?complete=false');
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

    router.delete('todo/:id', (req, res) => {
      const itemId = req.params.id;
      items.deleteOne({_id: ObjectId(itemId)})
        .then(() => {
          res.redirect(303, '/todo?complete=false');
        })
        .catch(error => console.error(error))
    })

  })

  //catching promise error for MongoClient connect
  .catch(error => { console.error(error) });

module.exports = router;
