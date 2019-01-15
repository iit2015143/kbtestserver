// Send status of a restaurant to it, if it is open or closed.

var MongoClient = require('mongodb').MongoClient;
var constants = require('./kbdelicates/constants.js');
var mongourl = constants.mongourl;

function getstatus (req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;
			var dbo = db.db("khanabottesting");
			dbo.collection("restaurants").findOne({"number":number},
			function(err,mres){
				if(err)
				throw err;
				if(mres.status){
					let status = mres.status;
					res.send({status:status});
				}
				else
					res.send({status:"off"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
};

module.exports = getstatus;