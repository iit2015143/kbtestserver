
var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

// Other Neccesary functions
var extractinfofornotif = require('./extractInfoForNotif');
var writeorderstatus = require('./writeOrderStatus');
const Order = require('../Models/order');

//Actual Body
function checkandwrite(id,status,fromnumber,tonumber,res){
	tonumber = parseInt(tonumber);
	Order.findOne({id :id,fromnumber : parseInt(fromnumber),tonumber : tonumber}).then((order) =>{
		if(order.status == "Pending"){
			res.send({status:"changed"});
			writeorderstatus(id,status,fromnumber,tonumber);
			extractinfofornotif("users",parseInt(fromnumber),"Your order has been "+status);  /* ------------------- extractinfofornotif,writeorderstatus ---------------------*/
		}
		else{
			res.send({status:"Already" +order.status});
		}
	});
}

// Exports
module.exports = checkandwrite;
