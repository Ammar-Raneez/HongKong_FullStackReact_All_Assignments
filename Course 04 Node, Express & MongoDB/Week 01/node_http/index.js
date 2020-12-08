const http = require("http")
const fs = require("fs");       //allows us to read/write local files
const path = require("path");   //path to files

const hostname = 'localhost';
const port = 3000;

//the browser sends a request to our server here, the request is sent once we visit localhost:3000 (the browser requests for localhost:3000)
const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} by method ${req.method}`);

//and our server responds to the request from the browser with this
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/html');
    //what it shows
    // res.end('<html><body><h1>hello World</h1></body></html>')   

    if(req.method === 'GET') {
        var fileUrl;
        if(req.url === '/') fileUrl = "/index.html" //if any other url which we dont have a file to, it'll fallback to index
        else fileUrl = req.url

        var filePath = path.resolve('./public'+fileUrl) //get absolute path of the file url (instead of /index.html, gives c://...)
        const fileExtension = path.extname(filePath)

        if(fileExtension == '.html') {
            //check if file exists, fs.exists(filePath) checks whether there's a html file at that absolute path
            fs.exists(filePath, exists => {
                if(!exists) {
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/html')
                    res.end('<html><body><h1>Error 404: ' + fileUrl + ' not found</h1></body></html>');
                    return;
                } else {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/html')
//createreadstream converts the file to a stream of bytes, we pipe it so that the actual file shows up on the response
                    fs.createReadStream(filePath).pipe(res)
                }
            })
        }
        //if it's not a html file
        else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/html')
            res.end('<html><body><h1>Error 404: ' + fileUrl + ' not an html file</h1></body></html>');
            return;
        }
    } 
//not a GET request
    else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html')
        res.end('<html><body><h1>Error 404: ' + req.method + ' not supported, only GET</h1></body></html>');
        return;
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})