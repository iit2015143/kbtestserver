ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

// Other Neccesary functions
var extractinfofornotif = require('./extractInfoForNotif');
var writeorderstatus = require('./writeOrderStatus');

//Actual Body
function checkandwrite(id,status,fromnumber,tonumber,res){
	tonumber = parseInt(tonumber);
	MongoClient.connect(mongourl,function(err,db){
	  if(err)
	  throw err;
	  dbo = db.db("khanabottesting");

		dbo.collection("restaurants")
		    .findOne({"number": tonumber},
		             {projection: { orders: { $elemMatch: { "id" : id} } } },
		             function(errT, resultT) {
			              //console.log(resultT);
		        		if(resultT.orders[0].status == "Pending"){
									res.send({status:"changed"});
									writeorderstatus(id,status,fromnumber,tonumber);
									extractinfofornotif("users",parseInt(fromnumber),"Your order has been "+status);  /* ------------------- extractinfofornotif,writeorderstatus ---------------------*/
								}
								else{
									res.send({status:"Already" +resultT.orders[0].status});
								}
		        	  db.close();
		});

	});
}

// Exports
module.exports = checkandwrite;
