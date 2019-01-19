var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;

function updatedatabasefordeclined(id,responder,fromnumber,tonumber){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");

		dbo.collection("logdeclinedorder").insert({
			"id":id,
			"actor":responder,
			"fromnumber":fromnumber,
			"tonumber":tonumber
		},
			function(err,mres){
				if(err)
				throw err;
				console.log("declined order logged");
		});

		db.close();
	});

}

module.exports=updatedatabasefordeclined;
