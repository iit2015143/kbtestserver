/*============================================================================================
                        Tests whether or not a user is logged in.
==============================================================================================*/

const router = require('express').Router();

var MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectID;

var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

var bodyParser = require('body-parser');
var urlEncodedParser =  bodyParser.urlencoded({extended : false});

router.post('/',urlEncodedParser,function(req,res){
	var query = {};
	console.log(req.body);
	query.number = parseInt(req.body.number);
	sess = req.session;
	query.uuid = req.body.uuid;
	MongoClient.connect(mongourl,{ useNewUrlParser: true },function(err,db){
		if(err)
		throw err;
		dbo = db.db("khanabottesting");

		dbo.collection("users").findOne(query,function(err,mres){
			if(err)
			throw err;
			if(mres==null){
				res.send({loggedin:false});
			}
			else{
				//console.log(mres);
				sess.number = query.number;
				sess.uuid = query.uuid;
				sess.loggedin = true;
				res.send({loggedin:true});
			}
			db.close();
		});
	});
});

module.exports = router;
