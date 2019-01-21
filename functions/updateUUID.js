ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

//Actual Body
function updateuuid(req,res,number,collection){
	sess = req.session;
	//uuid = Math.floor(Math.random()*999999999999 + 1000000000000);
	uuid = require('crypto').randomBytes(128).toString('hex');
	query={};
	query.number = number;
	MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;

			var dbo = db.db("khanabottesting");
			dbo.collection(collection).update(query,{$set:{uuid:uuid}},{upsert:true},function(err,mres){
					if(err)
					throw err;
					console.log("uuidupdated");
					sess.number = number;
					sess.uuid = uuid;
					sess.loggedin = true;
					res.send({uuid:uuid});
			});
	});
  return sess;
}

//Exports
module.exports = updateuuid;
