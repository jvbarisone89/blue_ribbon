//Require mongoose
var mongoose = require('mongoose');

//Create Schemas

//Comment Schema
var CommentSchema = mongoose.Schema({
  text: String
});

//Bank Schema
var BankSchema = mongoose.Schema({
  itemName: {type: String, required: true},
  price: {type: Number, required: false, default: 100},
  progress_added: {type: Number, required: false, default: 0},
  date: {type: String, required: false},
  deadline: {type: String, required: true},
  comments: [CommentSchema]
});

// create models, making copies of the schema

var Bank = mongoose.model('Bank', BankSchema);

// export these files

module.exports = Bank;