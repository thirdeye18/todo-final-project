//server.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');
const router = require('./routes/index');
const cors = require('cors');

//for storing values in .env file and retrieving them
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

const port = 3000;

// ========================
// Midleware
// ========================

//make sure urlencoded before CRUD handelers
// app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(cors());

//handle routing with index.js
app.use('/', router);

// ========================
// Listen
// ========================
app.listen(port, function() {
  console.log(`listening on ${port}`);
})
