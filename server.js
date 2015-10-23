//Declarations
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var ejs = require('ejs');
var mongoose = require('mongoose');
var db = require("./models/index");

//Middleware
app.set('view engine', 'ejs');  
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Routes

//Index
app.get('/banks', function (req, res){
	db.Bank.find({}, function(err, banks){
		if(err){
			console.log(err);
		} else {
			res.render('index', {banks: banks});
		}
	});
});

//Show
app.get('/banks/:_id', function(req,res){
	var bank = banks[req.params.id];
	res.render('banks-show', {bank: bank});
});


//Create 
app.post('/banks', function(req, res){
	db.Bank.create(req.body, function(err, bank){
	if (err) {
		res.json(err);
	} else {
		console.log(bank);
		res.json(bank);
		}
	});
});

//Delete
app.delete('/banks/:_id', function(req,res){
	db.Bank.findById(req.params._id, function(err, bank){
		if(err){
			res.json(err);
		} else {
			db.Bank.remove(bank);
			res.json(bank);
			console.log('This bank was delete: ' + bank);
			bank.save();
		}
	});
});

//Update
app.put('/banks/:id', function(req, res){
	db.Bank.findById(req.params.id, function(err, bank){
	if(err){
		res.json(err);
	} else {
		bank.cashAdded = parseInt(req.body.cashAdded);
		bank.save();
		console.log(bank);
		//send back the cashAdded value to display on the page
		res.json(cashAdded);
		}
	});
});


//Edit





//New







//Server Listener
app.listen(3000, function() {
  console.log("server running on port 3000");
});