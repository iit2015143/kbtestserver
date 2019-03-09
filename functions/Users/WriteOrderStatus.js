
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;
const Order = require('../../Models/order');
const writeorderstatus=(id,status,fromnumber,tonumber) => {

	Order.findOneAndUpdate({id: id,fromnumber: fromnumber,tonumber:tonumber},{$set:
	{status : status}},{upsert:false},
		function(err,mres){
			if(err)
			throw err;
			console.log("restaurant order updated");
	});
}

module.exports=writeorderstatus;
