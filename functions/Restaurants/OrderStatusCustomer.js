//Changes status of order and is exercised by user.

var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;

const writeordestatus=require('../Users/WriteOrderStatus');
const updatedatabasefordeclined=require('../Utils/UpdateDatabaseDeclined');
const extractinfofornotif=require('../Utils/ExtractInfoNotif');
const Order = require('../../Models/order');

const orderStatusCustomer=(req,res) => {
	console.log(req.query);
		var id = req.query.id;
		var status = req.query.status;
		var fromnumber = parseInt(req.query.fromnumber);
		var tonumber = parseInt(req.query.tonumber);
		console.log(id,status,fromnumber,tonumber);
    Order.findOne({tonumber : tonumber,id : id,fromnumber : fromnumber}).then((order) =>{
      if(order.status == "Pending"){
        writeorderstatus(id,status,fromnumber,tonumber);
        updatedatabasefordeclined(id,"customer",fromnumber,tonumber);
        res.send({"status":"changed"});
        extractinfofornotif("restaurants",parseInt(order.tonumber),
          "The order " + id + " has been declined by the customer.");
      } else {
        res.send({"status":"Already " + order.status});
      }
    });
}

module.exports=orderStatusCustomer;
