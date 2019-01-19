//Sends orderhistory of a user and is capped by a specific limit.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;

const orderHistory=(req,res) => {
  const sess = req.session;

	if(sess && sess.loggedin){
		console.log("in order history");
		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;

			var dbo = db.db("khanabottesting");
			var orders =[];
			dbo.collection("users").findOne({"number":parseInt(sess.number)},
			function(err,mres){
				if(err)
				throw err;
				var dborders = mres.orders;
				if(dborders){

					for(var i=0; i<10; i++){
						if(dborders.length - i -1 >=0)
						orders.push(dborders[dborders.length -i - 1]);
						else {
							break;
						}
					}
				}
				//console.log(orders);
				res.send(orders);
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
}

module.exports=orderHistory;
