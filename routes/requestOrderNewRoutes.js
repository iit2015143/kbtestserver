/*============================================================================================
          Requests a new order to a specific restaurant after processing the order.
==============================================================================================*/

const router = require('express').Router();

var processrequestnew = require('../functions/processRequestNew');

var bodyParser = require('body-parser');
var urlEncodedParser =  bodyParser.urlencoded({extended : false});
const Order = require('../Models/order');

router.post('/',urlEncodedParser,function(req,res){
	sess = req.session;
	console.log("something came");
	if(sess && sess.loggedin){
		console.log("something came in");
		var order = req.body.order;
		//console.log(order);

		order = new Order(JSON.parse(order));
		console.log(order.ordermode,order.time);
		processrequestnew(order,sess.number);  /* ---------------------------------- processrequestnew --------------------------------------------- */
		res.send({"orders":"requested"});

	}
	else{
		res.send({loggedin:false});
	}
});

module.exports = router;
