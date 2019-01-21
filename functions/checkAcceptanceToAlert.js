ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

var constants = require('../kbdelicates/constants');
var adminOneNum=constants.adminOneNum;
var adminTwoNum=constants.adminTwoNum;
var mongourl = constants.mongourl;

// Other Neccesary functions
var sendmessagetorestaurant = require('./sendMessageToRestaurant');


// Actual Body
function checkacceptancetoalert(order){
	console.log("checking for inconsistency");
	tonumber = parseInt(order.tonumber);
	console.log(order.tonumber+"this is my tonumber");
	MongoClient.connect(mongourl,function(err,db){
	  if(err)
	  throw err;
	  dbo = db.db("khanabottesting");

		dbo.collection("restaurants")
		    .findOne({"number": tonumber},
		             {projection: { orders: { $elemMatch: { "id" : order.id} },msgnumber:1  } },
		             function(errT, resultT) {
			              //console.log(resultT);

		        		if(resultT.orders[0].status == "Pending"){
									if(resultT.msgnumber){
										sendmessagetorestaurant(resultT.msgnumber,order.id,order.mode,order.summary,order.total,"");  /* ------------------------------ sendmessagetorestaurant -----------------------------*/
									}
									else{
										sendmessagetorestaurant(tonumber,order.id,order.mode,order.summary,order.total,"");
									}
									sendmessagetorestaurant(adminOneNum,order.id,order.mode,order.summary,order.total,order.tonumber);
									sendmessagetorestaurant(adminTwoNum,order.id,order.mode,order.summary,order.total,order.tonumber);
								}
		        	  db.close();
		});

	});
}

// Exports
module.exports = checkacceptancetoalert;
