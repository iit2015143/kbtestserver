//Changes status of order and is exercised by user.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;

const writeordestatus=require('../Users/WriteOrderStatus');
const updatedatabasefordeclined=require('../Utils/UpdateDatabaseDeclined');
const extractinfofornotif=require('../Utils/ExtractInfoNotif');

const orderStatusCustomer=(req,res) => {
  const sess = req.session;
	console.log(req.body);
	console.log(req.query);
	if(sess && sess.loggedin){
		var id = req.query.id;
		var status = req.query.status;
		var fromnumber = parseInt(req.query.fromnumber);
		var tonumber = parseInt(req.query.tonumber);
		console.log(id,status,fromnumber,tonumber);

		MongoClient.connect(mongourl,function(err,db){
		  if(err)
		  throw err;
		  dbo = db.db("khanabottesting");

			dbo.collection("restaurants")
		    	.findOne({"number": tonumber},
			             {projection: { orders: { $elemMatch: { "id" : id} } } },
			             function(errT, resultT) {
				                console.log(resultT);
			        		if(resultT.orders[0].status == "Pending"){
										writeorderstatus(id,status,fromnumber,tonumber);
										updatedatabasefordeclined(id,"customer",fromnumber,tonumber);
										res.send({"status":"changed"});
										extractinfofornotif("restaurants",parseInt(resultT.orders[0].tonumber),
											"The order " + id + " has been declined by the customer.");
									}
									else{
										res.send({"status":"Already " + resultT.orders[0].status});
									}
			        	  db.close();
			});

		});

	}
	else{
		res.send({loggedin:false});
	}
}

module.exports=orderStatusCustomer;
