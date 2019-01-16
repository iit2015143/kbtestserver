// Set message number to restaurant document.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../kbdelicates/constants.js');
var mongourl = constants.mongourl;

function setmsgnumber (req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		var msgnumber = parseInt(req.query.msgnumber);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;
			var dbo = db.db("khanabottesting");
			dbo.collection("restaurants").update({"number":number},{$set:{msgnumber:msgnumber}},
			function(err,mres){
				if(err)
				throw err;
				res.send({status:"changed"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
};

module.exports = setmsgnumber;