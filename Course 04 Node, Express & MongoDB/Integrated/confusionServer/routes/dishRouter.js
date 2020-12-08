const express = require('express')
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');

const cors = require('./cors');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json())

dishRouter.route('/')
//*whenever we need to preflight our requests, the client will send the http options request
//*message and then obtain the reply from the server side before it sends its actual message
//*so we set this up initially
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
//*For /dishes endpoint -> only get is psbl for anyone, the rest only admin
//*any origin is okay for get, but for the rest we'll use our options
.get(cors.cors, (req, res, next) => {
    Dishes.find(req.query) 
        .populate('comments.author')    
        .then(dishes => {   
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dishes)   
        }, err => console.log(err))
        .catch(err => console.log(err))
})
//we must first verify that they're even a user before verifying that theyre an admin
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {    
    Dishes.create(req.body) 
        .then(dish => {
            console.log("Dish created", dish)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403                                
    res.end("Put operation not supported on dishes")    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
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
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403    
    res.end("Post operation not supported on dishes/" + req.params.dishId)
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then(resp => {
        console.log("Dish deleted")
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, err => console.log(err))
    .catch(err => console.log(err))
})

//exporting it so that it can be accessed in index
module.exports = dishRouter;