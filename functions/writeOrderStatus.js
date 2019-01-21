ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

//Actual Body
function writeorderstatus(id,status,fromnumber,tonumber){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");

		dbo.collection("restaurants").update({"number":tonumber,"orders.id":id},{$set:
		{"orders.$.status":status}},{upsert:false},
			function(err,mres){
				if(err)
				throw err;




				console.log("restaurant order updated");
		});

		dbo.collection("users").update({"number":fromnumber,"orders.id":id},{$set:
		{"orders.$.status":status}},{upsert:false},
			function(err,mres){
				if(err)
				throw err;
				console.log("user order updated");
		});

		db.close();
	});

}

module.exports = writeorderstatus;
