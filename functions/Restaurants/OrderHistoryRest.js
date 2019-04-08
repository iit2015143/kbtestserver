//Sends orderhistory of a restaurant and is capped by a specific limit.

var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;
const Order = require('../../Models/order');

const orderHistoryRest=(req,res) => {
		var number = parseInt(sess.number);
    Order.find({tonumber : number}).then((orders) =>{
      res.send(orders);
    });
	
}

module.exports=orderHistoryRest;
