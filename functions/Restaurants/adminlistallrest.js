// Lists all restaurants to admin

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
var mongourl = constants.mongourl;

function adminlistallrest (req,res){

	sess = req.session;
	sess.loggedin = true;

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("restaurants").find({}).
				project({number:1,name:1}).toArray(function(err,mres){
					res.send(mres);
					//console.log(mres);
      			});

			db.close();
		});
};

module.exports = adminlistallrest;