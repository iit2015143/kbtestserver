// Save user cart to user document for now not in use.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
var mongourl = constants.mongourl;

function addtocart (req,res){
	sess = req.session;
	
	if(sess && sess.loggedin){
		var number = parseInt(req.query.number);
		var cart = req.query.cart;
		console.log(cart);
		cart = JSON.parse(cart);

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("users").update({"number":number},{$set:{cart:cart}},
			function(err,mres){
						if(err)
						throw err;
						res.send({cart:"added"});
						//console.log(mres);
						db.close();
				});
		});
	}
	else {
		res.send({loggedin:false});
	};
};

module.exports = addtocart;