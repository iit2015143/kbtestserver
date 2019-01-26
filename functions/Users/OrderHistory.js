//Sends orderhistory of a user and is capped by a specific limit.

var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;
const Order = require('../../models/order');

const orderHistory=(req,res) => {
  const sess = req.session;

	if(sess && sess.loggedin){
		console.log("in order history");
    Order.find({fromnumber : sess.number}).then((orders) =>{
      res.send(orders);
    });
	}
	else{
		res.send({loggedin:false});
	}
}

module.exports=orderHistory;
