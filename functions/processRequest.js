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
function processrequest(mode,order,time,gLocation,number){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");
		var orders = {};
		orders.mode = mode;
		orders.time = time;
		orders.order = order;
		orders.status ="Pending";
		orders.fromnumber = parseInt(number);
		orders.tonumber = parseInt(order[0].number);
		orders.gLocation = gLocation;
		var date = new Date();
		orders.id = date.getTime()+""+(1000 + Math.floor(8999 * Math.random()));
		//console.log(orders);
		var total = 0;
		var summary = "";
		for(var i =0; i<order.length;i++){
			var price = order[i].price[parseInt(order[i].index)] * parseInt(order[i].quantity)
			total+=price;
			summary += order[i].name +" x " + order[i].quantity +" = "+price+", ";
		}
		if(mode=="book")
		summary = summary + "\nBook" +" in time : " + time + "mins";
		else {
			summary = summary + "\nCOD" +" in time : " + "__"+ "mins";
		}
		console.log(summary);
		console.log(total);
		orders.summary = summary;
		orders.total = total;

		dbo.collection("restaurants").update({"number":parseInt(orders.tonumber)},{
				$push : {
					"orders":orders
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
				"orders":orders
			}
		},{
			upsert:false
		},
		function(err,mres){
			if(err)
			throw err;
			console.log("updated in users");
		});

		extractinfofornotif("restaurants",parseInt(orders.tonumber),"There is a new order kindly see the order");  /* ------------------- extractinfofornotif,checkacceptancetodecline,checkacceptancetoalert ---------------------*/

		console.log("timer started");

		setTimeout(function(){
			checkacceptancetoalert(orders);
		},orderalert);

		setTimeout(function(){
			checkacceptancetodecline(orders.tonumber,orders.id);
		},ordertimeout);

		db.close();
	});
}

// Export
module.exports = processrequest;
