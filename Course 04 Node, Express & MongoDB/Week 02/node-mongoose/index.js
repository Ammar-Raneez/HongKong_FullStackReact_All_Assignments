//*Since mongoose is connected to mongodb server, it has access to all methods of the mongodb driver as well
const mongoose = require("mongoose");
const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/server";
const connect = mongoose.connect(url);

connect.then(db => {
    console.log("Connected correctly to server");
    //creating a new dish document from our model

    //Better way of creating an instance of Dishes
    Dishes.create({
        name: 'Uthappiza',
        description: 'test' 
    })
        .then(dish => {
            console.log(dish)
    //finds dish we found and update it, dish._id refers to the dish we found
            return Dishes.findByIdAndUpdate(dish._id, {
                $set: {description: 'Updated test'},    
            },
                {new: true} //once update is complete return the updated dish
            ).exec()
        })
        .then(dish => {
            console.log(dish)
            
            //pushing a comment into the comment field
            dish.comments.push({rating: 5, comment: "I'm getting a sinking feeling", author: "Leonardo di Carpaccio"})

            return dish.save()  //saving updated dish back into database
        })
        .then(dish => {
            console.log(dish)
            //close mongoose connection to database
            return mongoose.connection.close()
        })
        .catch(error => console.log(error))
})