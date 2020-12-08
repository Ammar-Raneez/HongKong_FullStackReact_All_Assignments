const express = require('express')
const bodyParser = require('body-parser');
const Favorites  = require('../models/favorites');
const authenticate  = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200); 
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user":req.user._id}) 
        .populate('user')
        .populate('dishes')
        .then(favorites => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(favorites)
        }, err => console.log(err))
        .catch(err => console.log(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user":req.user._id})    //look for user
        .then(favorite => {
            //there're favorites already, so append onto the list
            console.log(req.body.length)
            console.log(favorite)
            if(favorite) {
                console.log("Found user")
                //loop thru all the dishes
                for(let i=0; i<req.body.length; i++) {
                    //if the dish isnt already in favorites, add it
                    if(favorite.dishes.indexOf(req.body[i]._id) == -1) {
                        favorite.dishes.push(req.body[i]._id)
                    }
                }
                //save after updating
                favorite.save()
                    .then(favorite => {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favorite)
                    }, err => console.log(err))
                    .catch(err => console.log(err))
            }
            //no current favorites, so should create a new document
            else {
                Favorites.create({"user": req.user._id, "dishes": req.body})  
                .then(favorite => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite)
                }, err => console.log(err))
                .catch(err => console.log(err))
            }
        }, err =>console.log(err))
        .catch(err => console.log(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end("Put operation is not supported on /favorites")
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, user) => {
    Favorites.findOneAndRemove({"user":req.user._id}) 
        .then(favorites => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(favorites)
        }, err => console.log(err))
        .catch(err => console.log(err))
})


favoriteRouter.route("/:favoriteId")
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end("Get operation is not supported on /favorites/id")
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user":req.user._id})    
    .then(favorite => {
        if(favorite) {
            if(favorite.dishes.indexOf(req.params.favoriteId) == -1) {
                favorite.dishes.push(req.params.favoriteId)
            }
            favorite.save()
                .then(favorite => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite)
                }, err => console.log(err))
                .catch(err => console.log(err))
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": [req.params.favoriteId]})  
            .then(favorite => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite)
            }, err => console.log(err))
            .catch(err => console.log(err))
        }
    }, err =>console.log(err))
    .catch(err => console.log(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end("Put operation is not supported on /favorites/id")
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user":req.user._id}) 
    .then(favorite => {
        let favoriteIndex = favorite.dishes.indexOf(req.params.favoriteId);
        //search for specified dish in array of favorites
        if(favoriteIndex !== -1) {
            //if found remove 1 element from the found index (remove that dish)
            favorite.dishes.splice(favoriteIndex, 1)
            favorite.save()
                .then(favorite => {
                    res.statusCode = 200
                    res.setHeader('Content-Type','application/json')
                    res.json(favorite)
                }, err => console.log(err))
                .catch(err => console.log(err))
        }
        else {
            let err = new Error("Specified dish wasn't found!")
            err.status = 404
            return next(err)
        }
        
    }, err => console.log(err))
    .catch(err => console.log(err))
})

module.exports = favoriteRouter;