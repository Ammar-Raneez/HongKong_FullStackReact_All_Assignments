//will contain all rest api endpoints of /dishes
const express = require('express')
const bodyParser = require('body-parser');

//declares dishRouter as an express router
const dishRouter = express.Router();
dishRouter.use(bodyParser.json())

//*For /dishes endpoint
//why "/"? not "/dishes".
//*We need to mount this in the index.js file, we'll mount this at "/dishes" in index
dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res, next) => {
    res.end("Will send all the dishes to you")          
})
.post((req, res, next) => {
    res.end("Will add the dish: " + req.body.name+ " with details: " + req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403                                
    res.end("Put operation not supported on dishes")    
})
.delete((req, res, next) => {
    res.end("Deleting all dishes")
})

//*We can remove them all and chain them together to the route
//*Firstly we can remove the "app" section cuz we've connected everything to dishRouter.route()
//*Furthermore, we can remove the endpoints as well, cuz we can chain the endpoints to route()


//*For /dishes/id endpoint
dishRouter.route('/:dishId')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res, next) => {
    res.end("Will send details of the dish: " + req.params.dishId)      //extracting the dishIh from the requested url param
})
.post((req, res, next) => {
    res.statusCode = 403    
    res.end("Post operation not supported on dishes/" + req.params.dishId)
})
.put((req, res, next) => {
    res.write("Updating the dish: " + req.params.dishId)    //this just adds a line
    res.end("\nWill update the dish: " + req.body.name + " with details: " + req.body.description)
})

.delete((req, res, next) => {
    res.end("Deleting dish " + req.params.dishId)
})


//exporting it so that it can be accessed in index
module.exports = dishRouter;