const express = require('express')
const bodyParser = require('body-parser');
const app = express()

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.post('/ping', function (req, res) {
  res.send(req.body)
  console.log(req.body);
  var insertDocuments = function(db) {
  // Get the documents collection
  var collection = db.collection('loginDetails');
  // Insert some documents
  collection.insertMany([
    req.body
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    
  });
}

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  insertDocuments(db);
 // findDocuments(db);
  db.close();
});
  
 

})
app.get('/ping',function (req, res) {
// Use connect method to connect to the server

//console.log(req.query.username);
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  findDocuments(db);
  db.close();
});
var findDocuments = function(db) {
  // Get the documents collection

    var collection = db.collection('loginDetails');
  // Find some documents
  console.log(req.query.username);
  collection.find({
  $and: [{"username": req.query.username},
  {"password":req.query.password}]}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs.length)
    if(docs.length>0){
	console.log("inside");
	res.send({"found":"true"});
	}
	else{
	console.log("outside");
	res.send({"found":"false"});
	}
  });

  
  
  /*var collection = db.collection('loginDetails');
  // Find some documents
  console.log(collection.findOne({
  $and: [{"username": req.query.username},
  {"password":req.query.password}]}));
  
  
	if (collection.findOne({
  $and: [{"username": req.query.username},
  {"password":req.query.password}]})){
  console.log("sending...");
res.send({"anuja2":"jkasdfnh"});
    
}
else{
console.log("Not found");
res.send({"anuja3":"jkasdfnh"});
}*/
}

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
