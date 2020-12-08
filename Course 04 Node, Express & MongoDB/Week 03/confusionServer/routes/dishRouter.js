const express = require('express')
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json())

dishRouter.route('/')
//*For /dishes endpoint -> only get is psbl for anyone, the rest only admin
.get((req, res, next) => {
    Dishes.find({}) 
        .populate('comments.author')    
        .then(dishes => {   
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dishes)   
        }, err => console.log(err))
        .catch(err => console.log(err))
})
//we must first verify that they're even a user before verifying that theyre an admin
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {    
    Dishes.create(req.body) 
        .then(dish => {
            console.log("Dish created", dish)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403                                
    res.end("Put operation not supported on dishes")    
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.remove({})   
        .then(resp => {
            console.log("Dishes deleted")
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, err => console.log(err))
        .catch(err => console.log(err))
})


//*For /dishes/id endpoint -> same as /dishes
dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .populate('comments.author')
        .then(dish => {
            console.log("Dish created", dish)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403    
    res.end("Post operation not supported on dishes/" + req.params.dishId)
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
//* -> post is psbl for regular users, but delete isnt 
dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId) 
        .populate('comments.author')
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
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId) 
        .then(dish => {
            if(dish != null) {
//*we updated the dish schema so the author field holds an object id for the user document
//*However the user id is specified in the req, cuz of the authentication
//*That user id can be stored into our author field
//*Cuz the currently logged in person will only enter the rating and comment, they wont be entering the author again
//*But, we have access to their id
                req.body.author = req.user._id
                //first update the comments array by pushing the body of the request onto the array
                dish.comments.push(req.body)
                dish.save() //then we're saving it in tbe database
                    .then(dish => {
                        Dishes.findById(dish._id)
                            .populate('comments.author')    //we need to populate the comments author when we post it
                            .then(dish => {                 //the actual comment
                                res.statusCode = 200    //and we're returning the updated dish
                                res.setHeader('Content-Type', 'application/json')
                                res.json(dish)  
                            })
                    })
            }  else {
                err = new Error('Dish ' + req.params.dishId + " not found.")
                err.status = 404;
                return next(err);   
            }
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403                                
    res.end("Put operation not supported on dishes/" + req.params.dishId + "/comments")    
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
//*A regular user can delete/update their own comment
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .populate('comments.author')
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
//remember req.params has the url params of the entire url, so a param after comments/ is req.params.commentId
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { 
    res.statusCode = 403    
    res.end("Post operation not supported on dishes/" + req.params.dishId + "comments/" + req.params.commentId)
})
//only the user that added the specific comment can update it/ delete it.
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then(dish => {
            console.log(dish.comments.id(req.params.commentId).author._id.toString('hex'));
            console.log(req.user._id)
            console.log(dish.comments.id(req.params.commentId).author._id.toString('hex') == req.user._id)
            //here the body of the content has the modified comment                                 //a raw buffer is returned, so need to convert
            if (dish != null && dish.comments.id(req.params.commentId) != null && ((dish.comments.id(req.params.commentId).author._id.toString('hex')) == req.user._id)) {
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
                        Dishes.findById(dish._id)
                            .then(dish => {
                                res.statusCode = 200    
                                res.setHeader('Content-Type', 'application/json')
                                res.json(dish)  
                            })
                    })
            }
            else if(dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else if (dish.comments.id(req.params.commentId) == null)  {
                err = new Error('Comment ' + req.params.commmentId + ' not found')
                err.status = 404;
                return next(err);
            }else {
                err = new Error('You are not Authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)  
        .then(dish => {
            if(dish != null) {
                if(dish != null && dish.comments.id(req.params.commentId) != null  && ((dish.comments.id(req.params.commentId).author._id.toString('hex')) == req.user._id)) { 
                    dish.comments.id(req.params.commentId).remove();  
                }
                dish.save()
                .then(dish => {
                    Dishes.findById(dish._id)
                    .then(dish => {
                        res.statusCode = 200    
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)  
                    })
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