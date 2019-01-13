ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

// Other Neccesary functions
var sendnotification = require('./sendNotification');

// Actual Body
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
						sendnotification(message ,mres.notificationid); /* ------------------------------ sendnotification ---------------------------------- */
					}
				}
		});
	});
}
// Exports
module.exports = extractinfofornotif;
