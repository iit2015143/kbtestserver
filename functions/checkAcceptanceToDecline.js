ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

// Other Neccesary functions
var extractinfofornotif = require('./extractInfoForNotif');
var writeorderstatus = require('./writeOrderStatus');

// Actual Body
function checkacceptancetodecline(tonumber,id){
	console.log("checking for inconsistency");
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
									writeorderstatus(resultT.orders[0].id,"Declined",
										parseInt(resultT.orders[0].fromnumber),parseInt(resultT.orders[0].tonumber));

									extractinfofornotif("users",parseInt(resultT.orders[0].fromnumber),          /* ------------------- extractinfofornotif,writeorderstatus ---------------------*/
										"Your order has been auto declined, sorry for inconvenience");

									extractinfofornotif("restaurants",parseInt(resultT.orders[0].tonumber),
										"The order has been declined as you did not respond.");
								}
		        	  db.close();
		});

	});
}

// Exports
module.exports = checkacceptancetodecline;
