const express = require('express')
const bodyParser = require('body-parser');
const app = express()

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

  var db;

// Initialize connection once
MongoClient.connect("mongodb://localhost:27017/myproject", function(err, database) {
  if(err) throw err;

  db = database;

  // Start the application after the database connection is ready
  app.listen(3000);
  console.log("Listening on port 3000");
});
  
  
// Connection URL
//var url = 'mongodb://localhost:27017/myproject';
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
})
app.get('/women',function (req, res) {
	  console.log(req.query.size);
    var collection = db.collection('womenTable');
  collection.find({"size": req.query.size}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    if(docs.length>0){
	res.send(docs);
	}
	else{
	res.send("not found");
	}
  });
});
app.get('/ping',function (req, res) {
    var collection = db.collection('loginDetails');
  // Find some documents
  console.log(req.query.username);
  collection.find({
  $and: [{"username": req.query.username},
  {"password":req.query.password}]}).toArray(function(err, docs) {
    assert.equal(err, null);
    if(docs.length==1){
	console.log("inside");
	res.send(docs[0]);
	}
	else{
	res.send(null);
	}
  });
});


