var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
var mongourl = constants.mongourl;

const updateuuid=(req,res,number,collection) => {
	const sess = req.session;
	//uuid = Math.floor(Math.random()*999999999999 + 1000000000000);
	const uuid = require('crypto').randomBytes(128).toString('hex');
	const query={};
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
}


module.exports=updateuuid;
