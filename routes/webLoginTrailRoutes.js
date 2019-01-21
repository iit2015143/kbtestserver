/*============================================================================================
          Simple utility to check whether or not web pages are opened by admin.
==============================================================================================*/

const router = require('express').Router();

var bodyParser = require('body-parser');
var urlEncodedParser =  bodyParser.urlencoded({extended : false});

router.post('/',urlEncodedParser,function(req,res){
	sess = req.session;
	sess.number = 7488663497;
	sess.loggedin = true;
	res.send({loggedin:true});
});

module.exports = router;
