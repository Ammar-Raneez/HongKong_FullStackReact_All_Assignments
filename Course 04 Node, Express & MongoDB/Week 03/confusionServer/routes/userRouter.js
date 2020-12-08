var express = require('express');
var bodyParser = require("body-parser")
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();
router.use(bodyParser.json());


/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	User.find({}) 
		.then(users => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(users);
		}, err => console.log(err))
		.catch(err => console.log(err))
});

//*Registering user is the regular normal way, all it does is it adds the user into the database
//*And so when we login in that user id is in the database and so a token is provided for that specific user
router.post('/signup', (req, res, next) => {
	//a register method is provided by mongoose, new user(username), password, callback function
	User.register(new User({username: req.body.username}), 
		req.body.password, (err, user) => {
			//if there was an error in creating the user, triggered
			if(err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({err: err});
			}
			//else user is created
			else {
				if(req.body.firstname) {
					user.firstname = req.body.firstname
				}
				if(req.body.lastname) {
					user.lastname = req.body.lastname
				}	
				//the firstname and lastname aren't required, so we check to see whether or not it has been provided
				user.save((err, user) => {
					if(err) {
						res.statusCode = 500;
						res.setHeader('Content-Type', 'application/json');
						res.json({err: err});
						return;
					}
					passport.authenticate('local')(req, res, () => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({success: true, status: 'Registration Successful!'});
						});
				})			
			}
		}
	);
});

//passport.authenticate does everything. Checks whether its valid or not, if it is the callback function is called
//if not it throws an error
router.post('/login', passport.authenticate('local'), (req, res) => {
//*in json web token authentication a token is passed in each request rather than a session, this holds all the data
//*necessary, a token is less heavy than a session and so is scalable

//create token(function we created in authenticate.js), the user id is enough to identify user
	var token = authenticate.getToken({_id: req.user._id})	
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	//we return the token too, so in the body upon login, we can see the token value too for authorization
	res.json({success: true, token: token ,status: 'You are successfully logged in!'});
});


router.get('/logout', (req, res, next) => {
	if(req.session) {
		req.session.destroy();
		res.clearCookie('session-id');	

		res.redirect('/');
	} else {
		var err = new Error("You are not logged in!")
		err.status = 403;
		next(err);
	}
})

module.exports = router;
