const express = require("express");
const morgan = require("morgan");   //logs info about incoming request
const http = require("http");
const bodyParser = require('body-parser');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require("./routes/leaderRouter");
const promoRouter = require("./routes/promoRouter");

const HOSTNAME = "localhost";
const PORT = "3000"
const app = express()
// app.use(morgan);    //use morgan
app.use(bodyParser.json())  //allows us to parse body of request message if it is in json format, and can be accessed in the req.body

//any requests coming to /dishes endpoint will be handled by dishRouter (now you can see why we used "/")
//we're mounting the "/" onto "/dishes" 
app.use('/dishes', dishRouter)

app.use('/leaders', leaderRouter)

app.use('/promotions', promoRouter)

//serve static html files current directory name inside public folder
app.use(express.static(__dirname + '/public'))

//sets up our server, "use this server", this is the fallback default link for a non-existent file
//this is cuz the line above creates the links for each of our static html files
app.use((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end('<html><body><h1>This is an express server</h1></body></html>');
})

const server = http.createServer(app);
server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}`)
})