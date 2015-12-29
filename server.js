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
  cookie: { maxAge: 60000000000 }
}));

//Routes

//Home Page
app.get('/', function (req, res){
		res.render('splash');
});

//Sign Up Page
app.get('/signup', function(req,res){
	res.render('signup');
});
//New User
app.post('/users', function (req,res){
	var user = req.body;
	console.log(user);
	db.User.createSecure(user.username, user.email, user.password, function(err, user){
		if (err){
			console.log(err);
			res.json({error: err, user: null, msg: "There was an error with creating User"});
		} else {
			req.session.userId = user._id;
			req.session.user = user;
			res.json({user: user, msg: 'User created successfully'});
		}
	});
});

//Login Page
app.get('/login', function (req,res){
	res.render('login');
});
//UserLogin
app.post('/login', function(req, res){
	db.User.authenticate(req.body.email, req.body.password, function(err, loggedInUser){
		if(err){
			console.log('authentication error: ', err);
			res.status(500).send();
		} else {
			console.log('setting session user id ', loggedInUser._id);
			req.session.userId = loggedInUser._id;
			req.session.user= loggedInUser;
			res.json(req.session.user);
		}
	});
});

//Check Auth
app.get('/current-user',function (req,res){
	console.log(req.session);
	res.send(req.session.user);
});

//Logout
app.get('/logout', function(req, res){
	req.session.userId = null;
	req.session.user = null;
	res.redirect('/splash');
});

//Logged In Index
app.get('/home', function (req, res){
	if (req.session.user === null) {
		console.log('ITS NULLLLLL')
		res.redirect('/');
		} else {
		console.log("This is the SESSION: ", req.session);
		db.User.findOne({_id: req.session.userId}).populate('banks').exec(function(err, user){
		console.log("This is the USER:", user);
			if(err){
			console.log(err);
			} else {
			req.session.user.banks = user.banks;
			res.render('index', {banks: req.session.user.banks, username: req.session.user.username, userId: req.session.userId});
			}
		});
	}
});

//Create New Bank
app.post('/api/banks', function(req, res){
	db.Bank.create({name: req.body.name, cost: req.body.cost}, function(err, bank){
	if (err) {
		res.json(err);
	} else {
		db.User.findOne({_id: req.session.userId}, function(err, user){
			if (err) { 
				res.json(err);
			} else {
				user.banks.push(bank._id);
				user.save();
				console.log("This is the user! --> ", user);
			}
		});
		console.log(bank);
		res.json(bank);
		}
	});
});

//Delete
app.delete('/api/banks/:id', function(req,res){
	db.Bank.remove({_id: req.params.id}, function (err, result){
		if (err){
			console.log(err);
		} else {
			res.json("Success");
		}
	});
});

//Update 
app.put('/api/banks/:id', function(req, res) {
	db.Bank.findById(req.params.id, function(err, bank){
		var cash_added = parseInt(req.body.cash_added);
		if (err) {
			res.json(err);
		} else if ((bank.cash_added + cash_added) > bank.cost) {
			res.json(err);
			console.log('Too much cash added!');	
		} else {
			bank.cash_added += cash_added;
			bank.itemName = req.body.itemName || bank.itemName;
			bank.save(function(err, bank){
				if (err) {
					console.log(err);	
				} else {
					console.log(bank);
					res.json(bank);
				}
			});
		}
	});
});


// //Add Comment
// app.post('/api/banks/:bankId/comments', function (req, res) {
//   // set the value of the list id
//   var bankId = req.params.bankId;
//   // store new comment in memory with data from request body
//   var newComment = req.body.text;
//   console.log(req.body);
//   // find list in db by id and add new todo
//   console.log('This is the bankId ' + bankId);
//   db.Bank.findOne({_id: bankId}, function (err, foundBank) {
//     foundBank.comments.push({text: newComment});
//     // db.Bank.comments.push(newComment);
//    	foundBank.save(function (err, bank) {
//   	  res.json(bank);
//     });
//   });
// });

//Server Listener
app.listen(process.env.PORT || 3000, function() {
	console.log("server running on port 3000");
});