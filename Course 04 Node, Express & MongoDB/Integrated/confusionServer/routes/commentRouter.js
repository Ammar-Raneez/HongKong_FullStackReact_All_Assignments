const express = require('express')
const bodyParser = require('body-parser');
const Comments = require('../models/comments');
var authenticate = require('../authenticate');

const cors = require('./cors');

const commentRouter = express.Router();
commentRouter.use(bodyParser.json())

//we'll create an explicit router for comments (/comments)
//*dont need dishes explicity in comments, so we arent populating dishes
commentRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Comments.find(req.query) 
        .populate('author')
        .then(comments => {  
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(comments)  
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if(req.body != null) {
        //need only user id for reference
        req.body.author = req.user._id;
        Comments.create(req.body)
            .then(comments => {
                Comments.findById(comment._id)
                .populate('author')
                .then(comment => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comment)
                })
            }, err => console.log(err))
            .catch(err => console.log(err))
    } else {
        err = new Error('Comment not found in request body')
        err.status = 404;
        return next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403                                
    res.end("Put operation not supported on /comments/");    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Comments.remove({}) 
        .then(resp => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
        }, err => console.log(err))
        .catch(err => console.log(err))
})

commentRouter.route('/:commentId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Comments.findById(req.params.commentId)
        .populate('author')
        .then(comment => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(comment)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { 
    res.statusCode = 403    
    res.end("Post operation not supported on /comments/" + req.params.commentId)
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
        .then(comment => {
            if(comment != null) {
                if (!comment.author.equals(req.user._id)) {
                    var err = new Error('You arent authorized to update this comment');
                    err.status = 403;
                    return next(err);
                }
                req.body.author = req.user._id
                Comments.findByIdAndUpdate(req.params.commentId, {
                    $set: req.body
                }, {new: true}) 
                    .then(comment => {
                        Comments.findById(comment._id)
                        .populate('author')
                            .then(comment => {
                                res.statusCode = 200    
                                res.setHeader('Content-Type', 'application/json')
                                res.json(comment)  
                            })
                    })
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)  
        .then(comment => {
            if(comment != null) { 
                if(!comment.author.equals(req.user._id)) {
                    var err = new Error('You arent authorized to delete this comment');
                    err.status = 403;
                    return next(err);
                }
                Comments.findByIdAndRemove(req.params.commentId)  
                .then(resp => {
                    res.statusCode = 200    
                    res.setHeader('Content-Type', 'application/json')
                    res.json(resp)  
                }, err => console.log(err))
                .catch(err => console.log(err))
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);      
            }
        }, err => console.log(err))
        .catch(err => console.log(err))
})

module.exports = commentRouter;