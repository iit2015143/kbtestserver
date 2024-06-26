// Saves the location of restaurant in database

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
var mongourl = constants.mongourl;

function locationrest (req,res){

		var location = req.body.location;
		location = JSON.parse(location);
		location.lat= parseFloat(location.lat);
		location.long=parseFloat(location.long);

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			//If want to save location of user
			dbo.collection("restaurants").update({"number":parseInt(sess.number)},{
				$set : {
					location:{type : "Point",coordinates : [location.long,location.lat]}
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				res.send({location:"updated"});
				console.log("updated location in restaurant");
			});

			db.close();
		});
}

module.exports = locationrest;
