const MongoClient = require("mongodb").MongoClient; //requiring mongodb and assert
const dboperations = require("./operations");

const url = "mongodb://localhost:27017/";   //where the mongo server is running
const dbname = "confusionServer"

MongoClient.connect(url)
    .then(client => {
        console.log("Connected correctly to server")

        const db = client.db(dbname);

//solution to callback hell, its all chained together such that the current function returns the next to be called in the then method
        dboperations.insertDocument(db, "dishes", { name: "Vadonut", description: "Test"})
            .then(result => {
                console.log("Insert Document:\n", result.ops);

                //*if there's an error here the chain stops executing and the catch block is run
                //*else this line causes the next then() to be called, and so on...
                //*We know that the findDocuments method returns a promise, using that feature we can chain them all together
                return dboperations.findDocuments(db, "dishes");    
            })
            .then(result => {
                console.log("Found Documents:\n", result);

                return dboperations.updateDocument(db, "dishes", { name: "Vadonut" }, { description: "Updated Test" });
            })
            .then(result => {
                console.log("Updated Document:\n", result.result);

                return dboperations.findDocuments(db, "dishes");
            })
            .then(docs => {
                console.log("Found Updated Documents:\n", docs);
                                
                return db.dropCollection("dishes");
            })
            .then(result => {
                console.log("Dropped Collection: ", result);

                return client.close();
            })
            .catch(err => console.log(err));
})
.catch(err => console.log(err));