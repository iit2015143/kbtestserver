// Get message number from restaurant document.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
var mongourl = constants.mongourl;

function getmsgnumber (req,res){
		var number = parseInt(sess.number);

		MongoClient.connect(mongourl,function(err,db){
			if(err) throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("restaurants").find({"number": number}).toArray((err, docs) => {
				if (err) throw err;
				if (docs.length > 0) {
					res.send({msgnumber: docs[0].msgnumber});
				}
				else res.send();
			});

			db.close();
		});
	
};

module.exports = getmsgnumber;