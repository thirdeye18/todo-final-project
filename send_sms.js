const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const notificationOpts = {
  toBinding: JSON.stringify({
    binding_type: 'sms',
    address: '+13609195808',
  }),
  body: 'Knock-Knock! This is your first Notify SMS',
};

client.notify
  .services('ISc2a76c4c3433b2760ed8f0428df6e284')
  .notifications.create(notificationOpts)
  .then(notification => console.log(notification.sid))
  .catch(error => console.log(error));

//Calling this function will send an sms
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
