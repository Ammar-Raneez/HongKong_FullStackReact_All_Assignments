const assert = require("assert");

//the callback is called upon completion of the function
exports.insertDocument = (db, collection, document, callback) => {
    const coll = db.collection(collection);
    //no need of callback cuz we'll be using promises as a solution
    //this statement already returns a promise, so all we have to do is return it
    return coll.insert(document);
};

exports.findDocuments = (db, collection, callback) => {
    const coll = db.collection(collection);
    return coll.find({}).toArray();
}

exports.removeDocument = (db, collection, document, callback) => {
    const coll = db.collection(collection);
    //self-explanatory methods
    return coll.deleteOne(document);
}

exports.updateDocument = (db, collection, document, update, callback) => {
    const coll = db.collection(collection);
    return coll.updateOne(document, {$set: update}, null);
}