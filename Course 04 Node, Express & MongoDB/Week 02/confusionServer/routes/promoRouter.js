//will contain all rest api endpoints of /promos
const express = require('express')
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
const promoRouter = express.Router();
promoRouter.use(bodyParser.json())


promoRouter.route('/')
.get((req, res, next) => {
    Promotions.find({})
        .then(promotions => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post((req, res, next) => {
    Promotions.create(req.body)
        .then(promotions => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.put((req, res, next) => {
    res.statusCode = 403                                
    res.end("Put operation not supported on promos")    
})
.delete((req, res, next) => {
    Promotions.remove({})
        .then(promotions => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions)
        }, err => console.log(err))
        .catch(err => console.log(err))
})



promoRouter.route('/:promoId')
.get((req, res, next) => {
    Promotions.findById(req.params.promoId)
        .then(promotion => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion)
        }, err => console.log(err))
        .catch(err => console.log(err))    
})
.post((req, res, next) => {
    res.statusCode = 403    
    res.end("Post operation not supported on promotions/" + req.params.promoId)
})
.put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true})
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion)
    }, err => console.log(err))
    .catch(err => console.log(err))    
})
.delete((req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promoId)
        .then(promotion => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion)
        }, err => console.log(err))
        .catch(err => console.log(err))  
})

module.exports = promoRouter;