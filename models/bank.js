var mongoose = require('mongoose');

var BankSchema = mongoose.Schema({
  itemName: {type: String, required: true},
  price: {type: Number, required: true},
  cash_added: {type: Number, required: false, default:0},
  date: {type: String, require: false}
});

// create a model, making a copy of the schema
// http://mongoosejs.com/docs/models.html
var Bank = mongoose.model('Bank', BankSchema);

// export this file
module.exports = Bank;