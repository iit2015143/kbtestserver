/*============================================================================================
                        Tests whether or not a restaurant is logged in.
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
	query.number = parseInt(req.body.number);
	sess = req.session;
	query.uuid = req.body.uuid;
	MongoClient.connect(mongourl,{newUrlParser : true},function(err,db){
		if(err)
		throw err;
		dbo = db.db("khanabottesting");

		dbo.collection("restaurants").findOne(query,function(err,mres){
			if(err)
			throw err;
			if(mres==null){
				res.send({loggedin:false});
			}
			else{
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
