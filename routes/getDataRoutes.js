/*============================================================================================
                                            Gets User Data
==============================================================================================*/

const router = require('express').Router();

var MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectID;

var constants = require('../kbdelicates/constants');
var mongourl = constants.mongourl;

var bodyParser = require('body-parser');
var urlEncodedParser =  bodyParser.urlencoded({extended : false});

router.get('/',urlEncodedParser,function(req,res){
	let sess = req.session;
	if(sess && sess.loggedin){
		MongoClient.connect(mongourl,{ useNewUrlParser: true },function(err,db){
			if(err)
			throw err;
			dbo = db.db("khanabottesting");

			dbo.collection("users").findOne({number : sess.number},function(err,mres){
				if(err)
				throw err;
				if(mres==null){
					res.json({loggedin:false});
				} else {
					res.json(mres);
				}
				db.close();
			});
		});
	} else {
		return res.json({loggedin:false});
	}
});

module.exports = router;
