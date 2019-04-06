/*============================================================================================
          					Changes status of order and is execised by restaurant.
==============================================================================================*/

const router = require('express').Router();

var checkandwrite = require('../functions/checkAndWrite');
var extractinfofornotif = require('../functions/extractInfoForNotif');
var updatedatabasefordeclined = require('../functions/updateDatabaseForDeclined');
var writeorderstatus = require('../functions/writeOrderStatus');

router.get('/',function(req,res){
		sess = req.session;
		var id = req.query.id;
		var status = req.query.status;
		var fromnumber = parseInt(req.query.fromnumber);
		var tonumber = parseInt(sess.number);


		if(status=="Accepted"){
			//only restaurant can call this function users dont have permission
			checkandwrite(id,status,fromnumber,tonumber,res);
		}
		else{
			writeorderstatus(id,status,fromnumber,tonumber);
			if(status=="Declined"){
				updatedatabasefordeclined(id,"restaurant",fromnumber,tonumber);
			}
			extractinfofornotif("users",parseInt(fromnumber),"Your order has been "+status);  /* ------------------- extractinfofornotif,writeorderstatus,updatedatabasefordeclined,checkandwrite ---------------------*/
			res.send({status:"changed"});
		}


});

module.exports = router;
