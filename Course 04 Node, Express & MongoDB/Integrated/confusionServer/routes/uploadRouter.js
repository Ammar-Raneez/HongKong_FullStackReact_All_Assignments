const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer');   //a module that handles file uploads
var authenticate = require('../authenticate');

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json())

const cors = require('./cors');


//file storage options
const storage = multer.diskStorage({
    //where to store
    destination: (req, file, cb) => {
        //remember callback is called at the end, if there's an error next(err) is called and
        //it skips the rest of the function, so the file is stored in the specified destination only
        //if there's no error
        cb(null, 'public/images')
    },
    //file returned is the response, (cb is calback as suspected)
    filename: (req, file, cb) => {
        //give it the same name as the original chosen file
        cb(null, file.originalname) //there's no error
    }
})

//can specify what sort of files it will only accept
const imageFileFilter = (req, file, cb) => {
    //a regular expression, if the filename doesnt contain an extension specified
    //it means its not an image file, this way we can make sure only 
    //image files are uploaded
    //*.jpg | jpeg | png | gift at the end
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    //if satisfied issa fine
    cb(null, true);
}

//creating the multer
const upload = multer({ storage: storage, fileFilter: imageFileFilter });

//allow only post operations (makes sense cuz we only upload here)
uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
//*If user has been allowed access thru the verifyUser and the verifyAdmin as well
//*We can then call the middleware that'll handle uploads
//*upload is our multer object 
//*upload.single -> only one file, we specify imageFile, so that's the same key you must use to send the request (on postman)
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file); //the json returned has the url of the image
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;