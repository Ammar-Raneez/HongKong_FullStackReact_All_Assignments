//will contain all rest api endpoints of /leaders
const express = require('express')
const bodyParser = require('body-parser');
const Leaders  = require('../models/leaders');
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json())


leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
        .then(leaders => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leaders)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post((req, res, next) => {
    Leaders.create(req.body)
        .then(leaders => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leaders)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.put((req, res, next) => {
    res.statusCode = 403                                
    res.end("Put operation not supported on leaders")    
})
.delete((req, res, next) => {
    Leaders.remove({})
        .then(leaders => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leaders)
        }, err => console.log(err))
        .catch(err => console.log(err))
})



leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
        .then(leaders => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leaders)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post((req, res, next) => {
    res.statusCode = 403    
    res.end("Post operation not supported on leaders/" + req.params.leaderId)
})
.put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {new: true})
        .then(leaders => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leaders)
        }, err => console.log(err))
        .catch(err => console.log(err))
})

.delete((req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then(leaders => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leaders)
    }, err => console.log(err))
    .catch(err => console.log(err))})

module.exports = leaderRouter;