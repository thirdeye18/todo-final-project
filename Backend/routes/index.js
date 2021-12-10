const router = require('express').Router();
const express = require('express');

const {MongoClient, ObjectId} = require('mongodb');

//for debugging need to have hard coded password
const uri = `mongodb+srv://thirdeye18:jlfXhKJ3so00cL4H@cluster0.opwsp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

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
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

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

      if(!itemName || itemName.length === 0 || !complete || complete.length ===0) {
        return res.status(400).json({message: "Need name and complete status!"})
      }

      const item = {itemName, complete};

      if(dueDate && dueDate.length !== 0) {
        item.dueDate = dueDate;
      }else {
        item.dueDate = "No date selected";
      }

      //TODO: Value below is not used, why being passed
      items.insertOne(item)
        .then(() => {
          res.redirect(303, '/todo?complete=false')
        })
        .catch(error => console.error(error))
    })

    router.put('/todo', async(req, res) => {
      const{_id, itemName, dueDate, complete} = req.body;
      const newItem = {};
      if(itemName && itemName.length !== 0) {
        newItem.itemName = itemName;
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

    router.delete('/todo/:id', (req, res) => {
      const itemId = req.params.id;
      items.findOneAndDelete({_id: ObjectId(itemId)})
        .then((value) => {
          res.redirect(303, '/todo?complete=false');
        })
        .catch(error => console.error(error))
    })
  })

  //catching promise error for MongoClient connect
  .catch(error => { console.error(error) });

module.exports = router;
