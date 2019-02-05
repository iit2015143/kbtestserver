
var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;
const Order = require('../models/order');

//Actual Body
function writeorderstatus(id,status,fromnumber,tonumber){
	Order.findOneAndUpdate({id : id,fromnumber : fromnumber,tonumber : tonumber},{$set:
	{status : status}},{upsert:false},
		function(err,mres){
			if(err)
			throw err;
			console.log("restaurant order updated");
	});
}

module.exports = writeorderstatus;
