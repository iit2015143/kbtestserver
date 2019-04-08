// Save notification id of user

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
var mongourl = constants.mongourl;

function savenotificationidrest (req, res){
		var notificationid = req.query.notificationid;
		var number = parseInt(sess.number);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");
			//If want to save location of user
			dbo.collection("restaurants").update({"number":number},{
				$set : {
					"notificationid":notificationid
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("notificationid of restaurant updated");
				res.send({"notificationid":"updated"});
			});

			db.close();
		});

};

module.exports = savenotificationidrest;