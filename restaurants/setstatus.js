// Send status of a restaurant to its document, if it is open or closed.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../kbdelicates/constants.js');
var mongourl = constants.mongourl;

function setstatus (req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		var status = req.query.status;
		MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;
			var dbo = db.db("khanabottesting");
			dbo.collection("restaurants").update({"number":number},{$set:{status:status}},
			function(err,mres){
				if(err)
				throw err;
				res.send({status:status});
				//console.log(mres);
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
};

module.exports = setstatus;