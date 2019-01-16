// Save location (but function not used for now)

var MongoClient = require('mongodb').MongoClient;
var constants = require('../kbdelicates/constants.js');
var mongourl = constants.mongourl;

function savelocation (req,res){
	sess = req.session;

	if(sess && sess.loggedin){
		var lat = parseFloat(req.query.lat);
		var long = parseFloat(req.query.long);
		var locality;
		var houseorflatno;
		if(req.query.gLocation)
			gLocation = req.query.gLocation;
		else {
			gLocation="";
		}
		if(req.query.locality)
			locality = req.query.locality;
		else {
			locality="";
		}
		if(req.query.houseorflatno)
			houseorflatno = req.query.houseorflatno;
		else {
			houseorflatno="";
		}
		var Location={};
		Location.lat=lat;
		Location.long=long;
		Location.gLocation=gLocation;
		Location.locality=locality;
		Location.houseorflatno=houseorflatno;

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");
			//If want to save location of user
			dbo.collection("users").update({"number":parseInt(sess.number)},{
				$push : {
					"savedLocations":Location
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("updated location");
				res.send({"location":"saved"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
};

module.exports = savelocation;