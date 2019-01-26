
var constants = require('../kbdelicates/constants');
var adminOneNum=constants.adminOneNum;
var adminTwoNum=constants.adminTwoNum;
var mongourl = constants.mongourl;
const Order = require('../models/order');

// Other Neccesary functions
var sendmessagetorestaurant = require('./sendMessageToRestaurant');


// Actual Body
function checkacceptancetoalert(order){
	console.log("checking for inconsistency");
	tonumber = parseInt(order.tonumber);
	console.log(order.tonumber+"this is my tonumber");
	Order.findOne(order).then((order) => {
		if(order.status == "Pending"){
			if(false){ //stuff right here is doubtfull
				sendmessagetorestaurant(order.tonumber,order.id,order.mode,order.summary,order.total,"");  /* ------------------------------ sendmessagetorestaurant -----------------------------*/
			}
			else{
				sendmessagetorestaurant(tonumber,order.id,order.mode,order.summary,order.total,"");
			}
			sendmessagetorestaurant(adminOneNum,order.id,order.mode,order.summary,order.total,order.tonumber);
			sendmessagetorestaurant(adminTwoNum,order.id,order.mode,order.summary,order.total,order.tonumber);
		}
	});
}

// Exports
module.exports = checkacceptancetoalert;
