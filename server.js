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
app.get('/', function (req, res){
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
app.post('/api/banks', function(req, res){
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
app.delete('/api/banks/:_id', function(req,res){
	db.Bank.findById(req.params._id, function(err, bank){
		if(err){
			res.json(err);
		} else {
			console.log('This bank was deleted: ' + bank);
			db.Bank.remove(function(err, bank){
			res.json(bank);
			});
		}
	});
});

//Update
app.put('/api/banks/:id', function(req, res){
	db.Bank.findById(req.params.id, function(err, bank){
	if(err){
		res.json(err);
		console.log('This route didnt work!');
	} else {
		bank.cash_added += parseInt(req.body.cash_added);
		bank.progress += parseInt(req.body.progress);
		console.log(req.body);
		bank.save();
		console.log('This is the bank ' + bank);
		//send back the cashAdded value to display on the page
		res.json(bank);
		}
	});
});

//Edit





//New







//Server Listener
app.listen(3000, function() {
  console.log("server running on port 3000");
});