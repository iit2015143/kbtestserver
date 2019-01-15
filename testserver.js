var http = require("http");
var https = require("https");
var gcm = require('node-gcm');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var session = require('express-session');
ObjectId = require('mongodb').ObjectID;
var readConfig = require('./readConfig');
var MongoClient = require('mongodb').MongoClient;

// Constants
var constants = require('./kbdelicates/constants.js');
var port = constants.port;
var mongourl = constants.mongourl;

var config = readConfig();

//all app uses

app.use(session({
	secret: 'somesecret',
	resave: false,
  saveUninitialized: false,
	cookie:{
		maxAge: null
	}
}));

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
	extended:true
}));

app.use(express.static('public'));

app.use(express.static('../khanabotsite'));

//all path to server

app.get('/',function(req,res){
  res.send("Zrath Technology Private Limited welcomes you.");
});

app.all("/user/*",function(req,res,next){
    sess = req.session;
		if(sess != null && sess.loggedin == true){
			next();
			console.log("checked it");
		}
		else {
			res.redirect('/login.html');
		}
});

app.use('/user',express.static('secured'));

// Function modules
var checkandwrite = require('./functions/checkAndWrite');
var extractinfofornotif = require('./functions/extractInfoForNotif');
var getotp = require('./functions/getOTP');
var processrequestnew = require('./functions/processRequestNew');
var sendnotification = require('./functions/sendNotification');
var updatedatabasefordeclined = require('./functions/updateDatabaseForDeclined');
var updateuuid = require('./functions/updateUUID');
var updateuuidrest = require('./functions/updateUUIDRest');
var writeorderstatus = require('./functions/writeOrderStatus');

//Routes
const webLoginTrailRoutes = require('./routes/webLoginTrailRoutes');
app.use('/weblogintrail',webLoginTrailRoutes);
const loginRoutes = require('./routes/loginRoutes');
app.use('/login',loginRoutes);
const loginRestRoutes = require('./routes/loginRestRoutes');
app.use('/loginrest',loginRestRoutes);
const appVersionRoutes = require('./routes/appVersionRoutes');
app.use('/appversion',appVersionRoutes);
const appVersionRestRoutes = require('./routes/appVersionRestRoutes');
app.use('/appversionrest',appVersionRestRoutes);
const changeOrderStatusRestRoutes = require('./routes/changeOrderStatusRestRoutes');
app.use('/changeorderstatusrest',changeOrderStatusRestRoutes);
const checkStatusRoutes = require('./routes/checkStatusRoutes');
app.use('/checkstatus',checkStatusRoutes);
const requestOrderNewRoutes = require('./routes/requestOrderNewRoutes');
app.use('/requestordernew',requestOrderNewRoutes);
const shareLocationRoutes = require('./routes/shareLocationRoutes');
app.use('/shareLocation',shareLocationRoutes);

app.post('/number',function(req,res){
		insertme = {};
		checkme = {};
		sess = req.session;
		insertme.number = parseInt(req.body.number);
		checkme.number = insertme.number;
		insertme.otp = getotp(insertme.number);               /* ----------------getotp ----------------------- */
		date = new Date();
		insertme.date = date.getTime();
		console.log(insertme);
		MongoClient.connect(mongourl,function(err,db){
				if(err)
				throw err;
				dbo = db.db("khanabottesting");

				dbo.collection("usersotp").update(checkme,insertme,{upsert:true},function(err,mres){
						if(err)
						throw err;
						sess.number = insertme.number;
						//console.log(sess.number);
						res.send({otp:"sent"});
						console.log("otp sent at "+ insertme.date);
						//console.log(mres);
						db.close();
				});
		});
});

app.post('/otp',function(req,res){
		checkme={};
		sess = req.session;
		checkme.number = parseInt(sess.number);
		checkme.otp = req.body.otp;
		date = new Date();
		date = date.getTime();
		console.log(checkme);
		MongoClient.connect(mongourl,function(err,db){
				if(err)
				throw err;

				dbo = db.db("khanabottesting");
				console.log("db taken");
				dbo.collection("usersotp").findOne(checkme,function(err,mres){
						if(err)
						throw err;

						if(mres == null)
						res.send({otp:"invalid"});
						else{
							if(date - mres.date <=180000){
									sess = updateuuid(req,res,checkme.number,"users");             /* ---------------------- updateuuid --------------------- */
							}
							else {
								res.send({otp:"timeout"});
							}
						}
						db.close();
						console.log("db closed");
				});
		});
});

app.post('/otprest',function(req,res){
		checkme={};
		sess = req.session;
		//console.log(sess.number);
		checkme.number = parseInt(sess.number);
		checkme.otp = req.body.otp;
		date = new Date();
		date = date.getTime();
		console.log(checkme);
		MongoClient.connect(mongourl,function(err,db){
				if(err)
				throw err;

				dbo = db.db("khanabottesting");
				console.log("db taken");
				dbo.collection("usersotp").findOne(checkme,function(err,mres){
						if(err)
						throw err;

						if(mres == null)
						res.send({otp:"invalid"});
						else{
							if(date - mres.date <=180000){
									sess = updateuuidrest(req,res,checkme.number,"restaurants");  /* ----------------------------- updateuuidrest ----------------------------------*/
							}
							else {
								res.send({otp:"timeout"});
							}
						}
						db.close();
						console.log("db closed");
				});
		});
});

app.get('/logout',function(req,res){
    sess = req.session;
    if(sess && sess.loggedin== true){
      sess.loggedin=false;
      sess.number = "";
      sess.uuid = "";
    }
    req.session.destroy(function(err){
      if(err)
      throw err;
      console.log("session destroyed");
    });
    res.send({loggedout:"true"});
});

app.get('/savenotificationid',function(req, res){
	sess=req.session;
	if(sess && sess.loggedin==true){
		var notificationid = req.query.notificationid;
		console.log(req.query);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");
			//If want to save location of user
			dbo.collection("users").update({"number":parseInt(sess.number)},{
				$set : {
					"notificationid":notificationid
				}
			},{
				upsert:true
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("notificationid updated");
				res.send({"notificationid":"updated"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}

});

app.get('/savenotificationidpradeep',function(req, res){
	sess=req.session;
	sess.loggedin=true;
	if(sess && sess.loggedin==true){
		var notificationid = req.query.notificationid;
		var number = parseInt(req.query.number);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");
			//If want to save location of user
			dbo.collection("restaurants").update({"number":number},{
				$set : {
					"notificationid":notificationid
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("notificationid of pradeep updated");
				res.send({"notificationidpradeep":"updated"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}

});

app.get('/savenotificationidrest',function(req, res){
	sess=req.session;
	if(sess && sess.loggedin==true){
		var notificationid = req.query.notificationid;
		var number = parseInt(sess.number);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");
			//If want to save location of user
			dbo.collection("restaurants").update({"number":number},{
				$set : {
					"notificationid":notificationid
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("notificationid of restaurant updated");
				res.send({"notificationid":"updated"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}

});

app.post('/getmerest',function(req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseInt(req.body.number);
		sess.number = number;
		res.send({status:"done"});
	}
});

app.get('/adminlistallrest',function(req,res){

	sess = req.session;
	sess.loggedin = true;

	if(sess && sess.loggedin){

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("restaurants").find({}).
				project({number:1,name:1}).toArray(function(err,mres){
					res.send(mres);
					//console.log(mres);
      	});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.post('/locationrest',function(req,res){
	sess = req.session;

	if(sess && sess.loggedin){

		var location = req.body.location;
		location = JSON.parse(location);
		location.lat= parseFloat(location.lat);
		location.long=parseFloat(location.long);

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			//If want to save location of user
			dbo.collection("restaurants").update({"number":parseInt(sess.number)},{
				$set : {
					"Location":location
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				res.send({location:"updated"});
				console.log("updated location in restaurant");
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/savelocation',function(req,res){
	sess = req.session;

	if(sess && sess.loggedin){
		var lat = parseFloat(req.query.lat);
		var long = parseFloat(req.query.long);
		var locality;
		var houseorflatno;
		if(req.query.gLocation)
			gLocation = req.query.gLocation;
		else {
			gLocation="";
		}
		if(req.query.locality)
			locality = req.query.locality;
		else {
			locality="";
		}
		if(req.query.houseorflatno)
			houseorflatno = req.query.houseorflatno;
		else {
			houseorflatno="";
		}
		var Location={};
		Location.lat=lat;
		Location.long=long;
		Location.gLocation=gLocation;
		Location.locality=locality;
		Location.houseorflatno=houseorflatno;

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");
			//If want to save location of user
			dbo.collection("users").update({"number":parseInt(sess.number)},{
				$push : {
					"savedLocations":Location
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("updated location");
				res.send({"location":"saved"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/restaurantpage',function(req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseFloat(req.query.number);

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("restaurants").find({
				"number":number}).toArray(function(err,mres){
				res.send(mres);
				console.log(number);
      });
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/profilepage',function(req,res){
	sess = req.session;

	if(sess && sess.loggedin){
		var number = parseInt(req.query.number);

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("users").find({
				"number":number}).toArray(function(err,mres){
				res.send(mres);
				console.log(number);
      });
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/addtocart',function(req,res){
	sess = req.session;

	if(sess && sess.loggedin){
		var number = parseInt(req.query.number);
		var cart = req.query.cart;
		console.log(cart);
		cart = JSON.parse(cart);

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("users").update({"number":number},{$set:{cart:cart}},
			function(err,mres){
						if(err)
						throw err;
						res.send({cart:"added"});
						//console.log(mres);
						db.close();
				});
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/changeorderstatuscustomer',function(req,res){
	sess = req.session;
	console.log(req.body);
	console.log(req.query);
	if(sess && sess.loggedin){
		var id = req.query.id;
		var status = req.query.status;
		var fromnumber = parseInt(req.query.fromnumber);
		var tonumber = parseInt(req.query.tonumber);
		console.log(id,status,fromnumber,tonumber);

		MongoClient.connect(mongourl,function(err,db){
		  if(err)
		  throw err;
		  dbo = db.db("khanabottesting");

			dbo.collection("restaurants")
		    	.findOne({"number": tonumber},
			             {projection: { orders: { $elemMatch: { "id" : id} } } },
			             function(errT, resultT) {
				                console.log(resultT);
			        		if(resultT.orders[0].status == "Pending"){
										writeorderstatus(id,status,fromnumber,tonumber);
										updatedatabasefordeclined(id,"customer",fromnumber,tonumber);
										res.send({"status":"changed"});
										extractinfofornotif("restaurants",parseInt(resultT.orders[0].tonumber), /* ------------------- extractinfofornotif,writeorderstatus,updatedatabasefordeclined ---------------------*/
											"The order " + id + " has been declined by the customer.");
									}
									else{
										res.send({"status":"Already " + resultT.orders[0].status});
									}
			        	  db.close();
			});

		});

	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/orderhistory',function(req,res){
	sess = req.session;

	if(sess && sess.loggedin){
		console.log("in order history");
		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;

			var dbo = db.db("khanabottesting");
			var orders =[];
			dbo.collection("users").findOne({"number":parseInt(sess.number)},
			function(err,mres){
				if(err)
				throw err;
				var dborders = mres.orders;
				if(dborders){

					for(var i=0; i<10; i++){
						if(dborders.length - i -1 >=0)
						orders.push(dborders[dborders.length -i - 1]);
						else {
							break;
						}
					}
				}
				//console.log(orders);
				res.send(orders);
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/orderhistorypradeep',function(req,res){
	sess = req.session;
	sess.loggedin = true;
	if(sess && sess.loggedin){
		var number = parseInt(req.query.number);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");
			var orders =[];
			dbo.collection("restaurants").findOne({"number":number},
			function(err,mres){
				if(err)
				throw err;
				var dborders = mres.orders;
				console.log(dborders);
				if(dborders){
					for(var i=0; i<50; i++){
						//console.log(orders);
						if(dborders.length - i -1 >=0)
						orders.push(dborders[dborders.length -i - 1]);
						else {
							break;
						}
					}
				}
				console.log(orders);
				res.send(orders);
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/orderhistoryrest',function(req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");
			var orders =[];
			dbo.collection("restaurants").findOne({"number":number},
			function(err,mres){
				if(err)
				throw err;
				var dborders = mres.orders;
				if(dborders){
					for(var i=0; i<50; i++){
						//console.log(orders);
						if(dborders.length - i -1 >=0)
						orders.push(dborders[dborders.length -i - 1]);
						else {
							break;
						}
					}
				}
				//console.log(orders);
				res.send(orders);
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/getstatus',function(req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;
			var dbo = db.db("khanabottesting");
			dbo.collection("restaurants").findOne({"number":number},
			function(err,mres){
				if(err)
				throw err;
				if(mres.status){
					let status = mres.status;
					res.send({status:status});
				}
				else
					res.send({status:"off"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/setstatus',function(req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		var status = req.query.status;
		MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;
			var dbo = db.db("khanabottesting");
			dbo.collection("restaurants").update({"number":number},{$set:{status:status}},
			function(err,mres){
				if(err)
				throw err;
				res.send({status:status});
				//console.log(mres);
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/setmsgnumber',function(req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		var msgnumber = parseInt(req.query.msgnumber);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;
			var dbo = db.db("khanabottesting");
			dbo.collection("restaurants").update({"number":number},{$set:{msgnumber:msgnumber}},
			function(err,mres){
				if(err)
				throw err;
				res.send({status:"changed"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/setcallnumber',function(req,res){
	sess = req.session;
	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		var callnumber = parseInt(req.query.callnumber);
		MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;
			var dbo = db.db("khanabottesting");
			dbo.collection("restaurants").update({"number":number},{$set:{callnumber:callnumber}},
			function(err,mres){
				if(err)
				throw err;
				res.send({status:"changed"});
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/currenttime',function(req,res){
	let date = new Date();
	date = date.getHours();
	res.send({currenttime:date});
});

app.get('/getoffers',function(req,res){
	var number = parseInt(req.query.number);
	if(true || number == "9956837774"){
		var offers = [{name:"OFF15",minValue:150,maxDiscount:-1,mode:["book"]},
		{name:"OFF10",minValue:100,maxDiscount:-1}];
		res.send(offers);
	}
	else{
		res.send([]);
	}
});

var server = app.listen(port,function(req,res){
  console.log("server started on "+ port);
});

process.on('SIGINT',()=>{
	console.log("sigint called");
	server.close();
});
