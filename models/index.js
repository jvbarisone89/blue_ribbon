// require mongoose module
var mongoose = require("mongoose");
// connect to MongoDB
/*
you can check this by going to your console and using these commands
- use 'mongo' to open MongoDB
- use 'show dbs' to show your databases
- use 'use <your db name>' to select your databases
- use 'show collections' to show the models in your database
- use 'db.<modelName>.find()' to query your database for a model e.g, db.pizza.find()
*/
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/piggybank_app' // plug in the db name you've been using
);
// After creating a new model, require and export it:

module.exports.Bank = require('./bank.js');
module.exports.User = require('./user.js');
// module.exports.Comment = require('./comment.js');