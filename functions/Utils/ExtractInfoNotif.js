var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;

function extractinfofornotif(table,number,message){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");

		//sendnotification("Conditional message","fromnumber")
		console.log(table,number,message);
		dbo.collection(table).findOne({"number":number},function(err,mres){
				if(err)
				throw err;
				if(mres){
					if(mres.notificationid){
						sendnotification(message ,mres.notificationid);
					}
				}
		});

		db.close();
	});
}

module.exports=extractinfofornotif;
