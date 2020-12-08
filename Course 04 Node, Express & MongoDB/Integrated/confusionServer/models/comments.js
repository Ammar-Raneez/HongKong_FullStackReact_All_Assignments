const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const commentSchema = new Schema(
    {
        rating: {
            type: Number,
            max: 5,
            min: 1
        },
        comment: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,   //reference to object id of user document, allows us to populate
            ref: 'User',                    
            required: true
        },
        //comments referring to its corresponding dish
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    },
    {
        timestamps: true
    }
)

var Comments = mongoose.model('Comment', commentSchema)
module.exports = Comments;