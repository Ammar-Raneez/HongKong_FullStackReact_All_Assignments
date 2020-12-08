var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt
var jwt = require('jsonwebtoken')

var config = require('./config');

//passport local mongoose provides an authenticaion
//*the passport module takes in a authentication method (LocalStratergy) which it'll use to authenticate
//*in our case, passport-local-mongoose, gives a method
passport.use(new LocalStrategy(User.authenticate()));

//provides session functionality
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//creates json web token
exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600         //expire the token in an hour
    })   
}

var opts = {};
//the token can be passed thru the header/ body
//*Since we extract from auth header as bearer token, we'll have to the pass the token in postman as
//*Header Authorization , "bearer {theTokenReturnedUponLogin}"
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //for this example, extract it from the header
opts.secretOrKey = config.secretKey;    //encode with this key

//jwt based strategy(takes in the options and a verify function)
//done is the callback function
exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //*payload holds the unique id issued at and expiry date, since we create the token with expiresIn 3600s
    //*The expiry time is an hour from the issued time
    console.log("JWT PAYLOAD", jwt_payload) 
    

    //*Based on our strategy >>>
    //the jwt_payload holds an id which is used for identifying a user, remember we pass only the id in the login route
    //*So we search for the id from the jwt payload in the database
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if(err) {   //done() //error, user?
            return done(err, false);    //callback that passport will pass into the strategy, since there's an error user is false
        } else if(user) {
            return done(null, user)     //no error, found user
        } else {
            return done(null, false)    //no error but user not found
        }
    })
}))

//verification for admin
exports.verifyAdmin = (req, res, next) => {
    console.log(req.user)
    User.findOne({_id: req.user.id})
        .then(user => {
            if(user.admin) {    //if the admin flag is set to true, only then is the action possible
                next()
            }
            else {
                err = new Error("You are not authorized to perform this action!");
                err.status = 403;
                return next(err)
            }
        }, err => console.log(err))
        .then(err => console.log(err))
}

//the jwt strategy we created, the extracted token from line 27 is used to authenticate the user, not gonna use sessions
//passport.authenticate via jwt, jwt uses the jwt stragery that we specified above in order to authenticate
exports.verifyUser = passport.authenticate('jwt', {session: false})