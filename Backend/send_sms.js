const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function sendReminder(cellNumber, message) {
  //this sends the text message
  client.messages
  .create({
     body: message,
     from: process.env.TWILIO_FROM_SMS,
     to: "+1" + cellNumber //this needs to be updated with the data pulled from Mongo
   })
  .then(message => console.log(message.sid))
  .catch(err => console.error(err));
}

//compare dates will return true when the current date is 
function compareDates() {
  //24 hours converted to ms to get dueDate - 24 hours
  let dayToMs = 86400000;
  //current date
  let currentDate = new Date();
  //set time portion of date to 0
  currentDate.setHours(0, 0, 0, 0);

  let dueDate = new Date("12/14/2021"); //swap this for data pulled from database
  dueDate.setHours(0, 0, 0, 0);

  //returns true if the current date is <=24 hours from due date
  return (dueDate.valueOf() - currentDate.valueOf()) <= dayToMs;
}

module.exports = sendReminder;

// let myCell = 3609195808;
// let myMsg = "Testing Message";
// sendReminder(myCell, myMsg);
