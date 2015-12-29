//Require mongoose
var mongoose = require('mongoose');

//Comment Schema
var CommentSchema = mongoose.Schema({
  text: String
});

//Bank Schema
var BankSchema = mongoose.Schema({
  name: {type: String, required: true},
  cost: {type: Number, required: false, default: 100},
  cash_added: {type: Number, required: false, default: 0},
});

// create models, making copies of the schema
var Bank = mongoose.model('Bank', BankSchema);
// export these files
module.exports = Bank;