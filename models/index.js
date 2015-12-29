// require mongoose module
var mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/piggybank_app' // plug in the db name you've been using
);

module.exports.Bank = require('./bank.js');
module.exports.User = require('./user.js');