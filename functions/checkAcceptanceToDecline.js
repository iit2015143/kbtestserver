
var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

// Other Neccesary functions
var extractinfofornotif = require('./extractInfoForNotif');
var writeorderstatus = require('./writeOrderStatus');
const Order = require('../Models/order');

// Actual Body
function checkacceptancetodecline(tonumber,id){
	console.log("checking for inconsistency");
	tonumber = parseInt(tonumber);
	Order.findOne({id : id,tonumber : tonumber}).then((order) => {
		if(order.status == "Pending"){
			writeorderstatus(order.id,"Declined",
				parseInt(order.fromnumber),parseInt(order.tonumber));

			extractinfofornotif("users",parseInt(order.fromnumber),          /* ------------------- extractinfofornotif,writeorderstatus ---------------------*/
				"Your order has been auto declined, sorry for inconvenience");

			extractinfofornotif("restaurants",parseInt(order.tonumber),
				"The order has been declined as you did not respond.");
		}
	});
}

// Exports
module.exports = checkacceptancetodecline;
