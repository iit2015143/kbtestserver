ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

var constants = require('../kbdelicates/constants');
var ordertimeout = constants.ordertimeout;
var orderalert = constants.orderalert;
var mongourl = constants.mongourl;

// Other Neccesary functions
var extractinfofornotif = require('./extractInfoForNotif');
var checkacceptancetoalert = require('./checkAcceptanceToAlert');
var checkacceptancetodecline = require('./checkAcceptanceToDecline');

// Actual Body
function processrequestnew(order,number){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");
		order.fromnumber = parseInt(number);
		var date = new Date();
		order.id = date.getTime()+""+(1000 + Math.floor(8999 * Math.random()));
		//console.log(orders);

		var summary = "";
		for(var i =0; i<order.order.length;i++){
			// var price = order[i].price[parseInt(order[i].index)] * parseInt(order[i].quantity)
			// total+=price;
			summary += order.order[i].name +" x " + order.order[i].quantity +" = "+order.order[i].price+", ";
		}
		if(order.mode=="book")
		summary = summary + "\nBook" +" in time : " + order.time;
		else {
			summary = summary + "\nCOD" +" in time : " + order.time;
		}
		console.log(summary);
		console.log(order.total);
		order.summary = summary;

		dbo.collection("restaurants").update({"number":parseInt(order.tonumber)},{
				$push : {
					"orders":order
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("updated in restaurants");
		});


		//If want to save location of user
		dbo.collection("users").update({"number":parseInt(number)},{
			$push : {
				"orders":order
			}
		},{
			upsert:false
		},
		function(err,mres){
			if(err)
			throw err;
			console.log("updated in users");
		});

		extractinfofornotif("restaurants",parseInt(order.tonumber),"There is a new order kindly see the order");  /* ------------------- extractinfofornotif,checkacceptancetodecline,checkacceptancetoalert ---------------------*/

		console.log("timer started");

		setTimeout(function(){
			checkacceptancetoalert(order);
		},orderalert);

		setTimeout(function(){
			checkacceptancetodecline(order.tonumber,order.id);
		},ordertimeout);

		db.close();
	});
}

// Exports
module.exports = processrequestnew;
