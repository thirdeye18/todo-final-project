//app.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');
const { auth } = require('express-openid-connect');
const router = require('./routes/index');
//auto logs server requests for debugging
const logger = require('morgan');
//for storing values in .env file and retrieving them
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

//Constant variables
const port = 3000;
const baseURL = 'http://localhost:3000';
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: baseURL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_DOMAIN
};

//make sure urlencoded before CRUD handelers
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.use(express.static(path.join(__dirname, 'vacation_assignment')));
app.use(express.static('public'));

//for automated logging of requests, responses and related data using Morgan
app.use(logger('dev'));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
    res.locals.user = req.oidc.user;
    next();
  });

//handle routing with index.js
app.use('/', router);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // Error handlers
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: process.env.NODE_ENV !== 'production' ? err : {}
    });
  });
  
  // ========================
  // Listen
  // ========================
  app.listen(port, function() {
    console.log(`listening on ${port}`);
  })