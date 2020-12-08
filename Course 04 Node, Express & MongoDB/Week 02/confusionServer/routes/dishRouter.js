//will contain all rest api endpoints of /dishes
const express = require('express')
const bodyParser = require('body-parser');
//middleware schema model
const Dishes = require('../models/dishes');

//declares dishRouter as an express router
const dishRouter = express.Router();
dishRouter.use(bodyParser.json())

//we'll use mongoose and the Dishes model to communicate with the mongodb database
dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({}) //same thing applies here, find all dishes
        .then(dishes => {   //if found, status code 200 and content json
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dishes)    //responds with the raw json string in the database converted into json object
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post((req, res, next) => {
    Dishes.create(req.body) //create a dish in post
        .then(dish => {
            console.log("Dish created", dish)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.put((req, res, next) => {
    res.statusCode = 403                                
    res.end("Put operation not supported on dishes")    //post not supported for dishes endpoint
})
.delete((req, res, next) => {
    Dishes.remove({})   //remove all
        .then(resp => {
            console.log("Dishes deleted")
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, err => console.log(err))
        .catch(err => console.log(err))
})


//*For /dishes/id endpoint
dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then(dish => {
            console.log("Dish created", dish)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post((req, res, next) => {
    res.statusCode = 403    
    res.end("Post operation not supported on dishes/" + req.params.dishId)
})
.put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true})
        .then(dish => {
            console.log("Dish updated", dish)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then(resp => {
        console.log("Dish deleted")
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, err => console.log(err))
    .catch(err => console.log(err))
})



//*for /dishes/dishId/comments endpoint (remember comments is an array of documents itself containing many comment documents)
dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId) 
        .then(dish => {  
            //requested dish can be null 
            if(dish != null) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish.comments)  
            }  else {
                err = new Error('Dish ' + req.params.dishId + " not found.")
                err.status = 404;
                return next(err);   //remember errors are handled in the app.js file at the end, calling next(err) calls that function
            }
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishId) 
        .then(dish => {
            if(dish != null) {
                //first update the comments array by pushing the body of the request onto the array
                dish.comments.push(req.body)
                dish.save() //then we're saving it in tbe database
                    .then(dish => {
                        res.statusCode = 200    //and we're returning the updated dish
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)  
                    })
            }  else {
                err = new Error('Dish ' + req.params.dishId + " not found.")
                err.status = 404;
                return next(err);   
            }
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.put((req, res, next) => {
    res.statusCode = 403                                
    res.end("Put operation not supported on dishes/" + req.params.dishId + "/comments")    
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)  
        .then(dish => {
            if(dish != null) {
                for(let i=0; i<dish.comments.length; i++) { //we must loop thru and remove em each, ther's no easier way to delete sub-documents
                    dish.comments.id(dish.comments[i]._id).remove();    //deletes each sub-document
                }
                dish.save()
                .then(dish => {
                    res.statusCode = 200    
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish)  
                })
            }  else {
                err = new Error('Dish ' + req.params.dishId + " not found.")
                err.status = 404;
                return next(err);   
            }
        }, err => console.log(err))
        .catch(err => console.log(err))
})


//*for /dishes/dishId/comments/commentsId
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then(dish => {
            //we have to look at each scenario, if we only have both will we return
            //the dish exists, as well as the comments exist in the dish
            if(dish != null && dish.comments.id(req.params.commentId) != null) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish.comments.id(req.params.commentId))
            }
            //if there's no dish
            else if(dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            //if there's no comment, but there's a dish
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);      
            }
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post((req, res, next) => { //remember req.params has the url params of the entire url, so a param after comments/ is req.params.commentId
    res.statusCode = 403    
    res.end("Post operation not supported on dishes/" + req.params.dishId + "comments/" + req.params.commentId)
})
.put((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then(dish => {
            //here the body of the content has the modified comment
            if(dish != null && dish.comments.id(req.params.commentId) != null) {
                //user can only update the rating and comment fields
                if(req.body.rating) {
                    //overwriting the old rating
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save() 
                    .then(dish => {
                        res.statusCode = 200    //and we're returning the dish with the updated comment
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)  
                    })
            }
            else if(dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);      
            }
        })
        .catch(err => console.log(err))
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)  
        .then(dish => {
            if(dish != null) {
                if(dish != null && dish.comments.id(req.params.commentId) != null) { 
                    dish.comments.id(req.params.commentId).remove();  
                }
                dish.save()
                .then(dish => {
                    res.statusCode = 200    
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish)  
                })
            }
            else if(dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);      
            }
        }, err => console.log(err))
        .catch(err => console.log(err))
})

//exporting it so that it can be accessed in index
module.exports = dishRouter;