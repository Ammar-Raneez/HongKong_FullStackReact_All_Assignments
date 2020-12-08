//*Mongoose gives structure and format to our mongodb database
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
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

//a schema is basically a structure our documents must follow in order to be inserted into our database
//here we force the dishes to have a name and description, both of type string, and further the name of each dish
//must be unique, only if these requirements are satisfied, will the document be added.
const dishSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        //the comments document becomes a sub-document of our dish document, further comments is an array, following
        //the commentSchema validation we specified, where each comment is a document in the array of documents
        comments: [commentSchema]
    },
    //automatically adds timestamps to a document, createdAt and updatedAt
    {
        timestamps: true
    }
);

//mongoose further creates a collection by itself, by the name we provide as the model, but pluralized (Dishes)
var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;