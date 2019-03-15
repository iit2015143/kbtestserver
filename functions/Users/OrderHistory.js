//Sends orderhistory of a user and is capped by a specific limit.

var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;
const Order = require('../../Models/order');

const orderHistory=(req,res) => {
  const sess = req.session;
	if(sess && sess.loggedin){
    let page =  parseInt(req.query.page);
		console.log("in order history");
      Order.find({fromnumber : sess.number}).sort({id:-1}).skip(page*10).limit(10).then((orders) =>{
        res.send(orders);
      });
	}
	else{
		res.send({loggedin:false});
	}
}

module.exports=orderHistory;
