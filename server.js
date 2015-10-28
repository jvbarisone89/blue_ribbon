//Declarations
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var ejs = require('ejs');
var mongoose = require('mongoose');
var db = require("./models/index");
var session = require('express-session');

//Middleware
app.set('view engine', 'ejs');  
app.use(express.static("public"));
app.use(express.static("bower_components"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));

//Routes

//SignUp
app.get('/signup', function(req,res){
	res.render('signup');
});

//New User
app.post('/users', function (req,res){
	var user = req.body;
	db.User.createSecure(user.email, user.password, function(err, user){
	req.session.userId = user._id;
	req.session.user = user;
	res.json({user: user, msg: 'User created successfully'});
	});
});

//Check Auth
app.get('/current-user',function (req,res){
	res.json({user: req.session.user});
});

//Login
app.get('/login', function (req,res){
	res.render('login');
});

//Logout
app.get('/logout', function(req, res){
	req.session.userId = null;
	res.redirect('/login');
});

//Home Page
app.get('/', function (req, res){
		res.render('home');
});

//Logged In Index
app.get('/home', function (req, res){
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

//Update Progress Amount
app.put('/api/banks/:id', function(req, res) {
	db.Bank.findById(req.params.id, function(err, bank){
	var cash_added = parseInt(req.body.cash_added);
	if(err){
		res.json(err);
		console.log('This route didnt work!');
	} else if ((bank.cash_added + cash_added) > bank.price){
		res.json(err);
		console.log('Too much cash added');	
	} 
	else {
		bank.cash_added += parseInt(req.body.cash_added);
		bank.save();
		console.log('This is the bank ' + bank);
		//send back the cashAdded value to display on the page
		res.json(bank);
	}
	});
});

//Login
app.post('/login', function(req, res){
	db.User.authenticate(req.body.email, req.body.password, function(err, loggedInUser){
		if(err){
			console.log('authentication error: ', err);
			res.status(500).send();
		} else {
			console.log('setting session user id ', loggedInUser._id);
			req.session.userId = loggedInUser._id;
			res.json(loggedInUser._id);
		}
	});
});

//Add Comment
// create comment embedded in list
app.post('/api/banks/:bankId/comments', function (req, res) {
  // set the value of the list id
  var bankId = req.params.bankId;
  // store new comment in memory with data from request body
  var newComment = req.body.text;
  console.log(req.body);
  // find list in db by id and add new todo
  console.log('This is the bankId ' + bankId);
  console.log(newComment);
  db.Bank.findOne({_id: bankId}, function (err, foundBank) {
    foundBank.comments.push({text: newComment});
    // db.Bank.comments.push(newComment);
   	foundBank.save(function (err, bank) {
  	  res.json(bank);
    });
  });
});

//New

//Server Listener
app.listen(process.env.PORT || 3000, function() {
	console.log("server running on port 3000");
});