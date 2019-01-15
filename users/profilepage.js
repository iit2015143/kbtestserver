// Send the whole user document related to a particular number.

var MongoClient = require('mongodb').MongoClient;
var constants = require('./kbdelicates/constants.js');
var mongourl = constants.mongourl;

function profilepage (req,res){
	sess = req.session;

	if(sess && sess.loggedin){
		var number = parseInt(req.query.number);

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("users").find({
				"number":number}).toArray(function(err,mres){
				res.send(mres);
				console.log(number);
      });
		});
	}
	else{
		res.send({loggedin:false});
	}
}

module.exports = profilepage;