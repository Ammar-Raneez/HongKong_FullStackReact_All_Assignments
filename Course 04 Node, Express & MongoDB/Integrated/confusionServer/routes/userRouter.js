var express = require('express');
var bodyParser = require("body-parser")
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();
router.use(bodyParser.json());

const cors = require('./cors');


/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
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

router.post('/login', cors.corsWithOptions, (req, res, next) => {
	//genuine error display thru the info (user doesnt user, username/password incorrect)
	passport.authenticate('local', (err, user, info) => {
		//immediate error
		if(err) return next(err);

		//username/password incorrect
		if(!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: false, status: 'Login Unsuccessful', err: info});
		}

		//req.logIn added if successful
		req.logIn(user, err => {
			if(err) {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				res.json({success: false, status: 'Could not login user', err: info});
			}

			//everything is fine
			var token = authenticate.getToken({_id: req.user._id})	
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: true, status: 'Login Successful', token: token});
		})
	})(req, res, next);
});


router.get('/logout', cors.corsWithOptions, (req, res, next) => {
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


//facebook login
//facebook-token strategy, remember if we pass that middleware, the user is loaded onto the request object
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
	if(req.user) {
		var token = authenticate.getToken({_id: req.user._id});		//the json web token is now created
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({success: true, token: token, status: 'You are successfully logged in!'});	
	}
})


//sometimes jwt can expire while user is logged in
//if expired will return false, and client is prompted to login again
router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
	passport.authenticate('jwt', {session: false}, (err, user, info) => {
		if(err) return next(err);

		if(!user) {
			res.statusCode = 401
			res.setHeader('Content-Type', 'application/json')
			res.json({status: 'JWT invalid!', success: false, err: info})
		}
		else {
			res.statusCode = 200
			res.setHeader('Content-Type', 'application/json')
			res.json({status: 'JWT valid!', success: true, user: info})
		}
		//this thingie is needed for passport.authenticate
	}) (req, res);
})

module.exports = router;
