var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;
const updateuuid=require('./Updateuuid');

const updateuuidrest=(req,res,number,collection) => {
	const query={};
	query.number = number;
	const sess = req.session;	
	MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;

			var dbo = db.db("khanabottesting");
			dbo.collection(collection).findOne(query,function(err,mres){
					if(err)
					throw err;
					if(mres==null){
						updateuuid(req, res, number, collection);
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
}

module.exports=updateuuidrest;
