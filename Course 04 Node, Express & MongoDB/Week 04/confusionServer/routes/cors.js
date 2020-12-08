const express = require('express');
const cors = require('cors')    //handles our cross-origin problems
const app = express()

//origins server must accept
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    //*if incoming request origin is from the whitelist the index is returned, and the origin is set to true
    //*meaning its whitelisted so it adds access-control-allow-origin in the header for this origin
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    //*If not, we'll not add the access-control-allow-origin in the header
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

//*if we simply specify empty cors, it returns access-control-allow-origin-*, meaning allow everything
//*there'll be times when we need this - in get requests its fine to allow any
exports.cors = cors()
//*apply our options to this cors, so it'll add the access-control-allow-origin only to our whitelist 
exports.corsWithOptions = cors(corsOptionsDelegate);    

//*sending an options request message first you can get back this:
//*header Access-control-allow-methods is sent as a preflight, it contains all the methods that the server is willing to accept at that endpoint
//*specifying the user that these methods are acceptable, a preflight request is usually sent when there's a incoming request that'll have some
//*side effect on the main site (put/post/delete), so before the actual request is sent an options preflight request is sent for which the 
//*server will reply with the access-control-allow-methods