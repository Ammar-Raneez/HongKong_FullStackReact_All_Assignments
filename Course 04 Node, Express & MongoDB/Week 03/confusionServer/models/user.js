//create user schema that tracks username and password, we can distinguish regular users and admins
var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var User = new Schema(
    //username and password are automatically add username and hashed salt password
    {
        firstname: {
            type: String,
            default: ''
        },
        lastname: {
            type: String,
            default: ''
        },
        admin: {
            type: Boolean,
            default: false
        }
    }
)
User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User); 