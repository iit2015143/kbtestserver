// Get call number from restaurant document.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../kbdelicates/constants.js');
var mongourl = constants.mongourl;

function getcallnumber (req,res){
	sess = req.session;

	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;
			var dbo = db.db("khanabottesting");
			dbo.collection("restaurants").find({"number":number}).toArray((err, docs) => {
				if (err) throw err;
				if (docs.length > 0) {
					res.send({callnumber:docs[0].callnumber});
				}
				else {
					res.send();
				}
			})

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
};

module.exports = getcallnumber;