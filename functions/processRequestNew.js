
var constants = require('../kbdelicates/constants');
var ordertimeout = constants.ordertimeout;
var orderalert = constants.orderalert;
var mongourl = constants.mongourl;

// Other Neccesary functions
var extractinfofornotif = require('./extractInfoForNotif');
var checkacceptancetoalert = require('./checkAcceptanceToAlert');
var checkacceptancetodecline = require('./checkAcceptanceToDecline');
const Order = require('../models/order');

// Actual Body
function processrequestnew(order,number){
	order.fromnumber = parseInt(number);
	var date = new Date();
	order.id = date.getTime()+""+(1000 + Math.floor(8999 * Math.random()));
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
	order.summary = summary;
	order.save().then(() =>{
		extractinfofornotif("restaurants",parseInt(order.tonumber),"There is a new order kindly see the order");  /* ------------------- extractinfofornotif,checkacceptancetodecline,checkacceptancetoalert ---------------------*/

		console.log("timer started");

		setTimeout(function(){
			checkacceptancetoalert(order);
		},orderalert);

		setTimeout(function(){
			checkacceptancetodecline(order.tonumber,order.id);
		},ordertimeout);
	});
}

// Exports
module.exports = processrequestnew;
