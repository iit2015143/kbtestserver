ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

// Other Neccesary functions
var updateuuid = require('./updateUUID');

//Actual Body
function updateuuidrest(req,res,number,collection){
	sess = req.session;
	query={};
	query.number = number;
	MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;

			var dbo = db.db("khanabottesting");
			dbo.collection(collection).findOne(query,function(err,mres){
					if(err)
					throw err;
					if(mres==null){
						sess = updateuuid(req, res, number, collection);                         /* ------------------------ updateuuid -------------------------*/
					}
					else {
						console.log("uuid found and sent, multiple loggdin tracked\n" + mres.uuid);
						sess.number = number;
						sess.uuid = mres.uuid;
						sess.loggedin = true;
						res.send({uuid:mres.uuid});
					}
			});
			db.close();
	});
	return sess;
}

//Exports
module.exports = updateuuidrest;
