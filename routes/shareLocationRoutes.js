/*============================================================================================
      Fetches restaurants data and sends it to user and saves users location in database.
==============================================================================================*/

const router = require('express').Router();

var MongoClient = require('mongodb').MongoClient;
var readConfig = require('../readConfig');
var config = readConfig();
console.log(config);
ObjectId = require('mongodb').ObjectID;

var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;
var bodyParser = require('body-parser');
var urlEncodedParser =  bodyParser.urlencoded({extended : false});

router.post('/',urlEncodedParser,function(req,res){
	sess = req.session;

	if(sess && sess.loggedin){
		var lat = parseFloat(req.body.lat);
		var long = parseFloat(req.body.long);
		if(req.body.gLocation){
			gLocation = req.body.gLocation;
			sess.gLocation=gLocation;}
		else {
			gLocation="";
		}
		sess.lat = lat;
		sess.long = long;
		var Location={};
		Location.lat=lat;
		Location.long=long;
		Location.gLocation=gLocation;

		MongoClient.connect(mongourl,{newUrlParser : true},function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("restaurants").find({
				"Location.lat":{$gt:lat-config.dlatitude,$lt:lat+config.dlatitude},
				"Location.long":{$gt:long-config.dlongitude,$lt:long+config.dlongitude},"status":"on","admin":"on"}).
				project({orders:0, _id:0,notificationid:0,uuid:0}).sort({rating:-1}).toArray(function(err,mres){
					res.send(mres);
					//console.log(mres);
					console.log(lat,long);
      	});

			//If want to save location of user
			dbo.collection("users").update({"number":parseInt(sess.number)},{
				$set : {
					"Location":Location
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("updated location");
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

module.exports = router;
