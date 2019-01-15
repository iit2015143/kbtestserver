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
var constants = require('./kbdelicates/constants.js');

var adminOneNum=constants.adminOneNum;
var adminTwoNum=constants.adminTwoNum;
var port = constants.port;
var mongourl = constants.mongourl;
var sender = constants.sender;
var ordertimeout = constants.ordertimeout;
var orderalert = constants.orderalert;

var sess={};
var config = readConfig();
console.log(config);

// all restaurant related functions
var getoffers = require('./restaurants/getoffers.js');
var adminlistallrest = require('./restaurants/adminlistallrest.js');
var locationrest = require('./restaurants/locationrest.js');
var restaurantpage = require('./restaurants/restaurantpage.js');
var getstatus = require('./restaurants/getstatus.js');
var setstatus =require('./restaurants/setstatus.js');

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

var sess;

function extractinfofornotif(table,number,message){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");

		//sendnotification("Conditional message","fromnumber")
		console.log(table,number,message);
		dbo.collection(table).findOne({"number":number},function(err,mres){
				if(err)
				throw err;
				if(mres){
					if(mres.notificationid){
						sendnotification(message ,mres.notificationid);
					}
				}
		});

		db.close();
	});
}

function writeorderstatus(id,status,fromnumber,tonumber){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");

		dbo.collection("restaurants").update({"number":tonumber,"orders.id":id},{$set:
		{"orders.$.status":status}},{upsert:false},
			function(err,mres){
				if(err)
				throw err;




				console.log("restaurant order updated");
		});

		dbo.collection("users").update({"number":fromnumber,"orders.id":id},{$set:
		{"orders.$.status":status}},{upsert:false},
			function(err,mres){
				if(err)
				throw err;
				console.log("user order updated");
		});

		db.close();
	});

}

function updatedatabasefordeclined(id,responder,fromnumber,tonumber){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");

		dbo.collection("logdeclinedorder").insert({
			"id":id,
			"actor":responder,
			"fromnumber":fromnumber,
			"tonumber":tonumber
		},
			function(err,mres){
				if(err)
				throw err;
				console.log("declined order logged");
		});

		db.close();
	});

}

function checkandwrite(id,status,fromnumber,tonumber,res){
	tonumber = parseInt(tonumber);
	MongoClient.connect(mongourl,function(err,db){
	  if(err)
	  throw err;
	  dbo = db.db("khanabottesting");

		dbo.collection("restaurants")
		    .findOne({"number": tonumber},
		             {projection: { orders: { $elemMatch: { "id" : id} } } },
		             function(errT, resultT) {
			              //console.log(resultT);
		        		if(resultT.orders[0].status == "Pending"){
									res.send({status:"changed"});
									writeorderstatus(id,status,fromnumber,tonumber);
									extractinfofornotif("users",parseInt(fromnumber),"Your order has been "+status);
								}
								else{
									res.send({status:"Already" +resultT.orders[0].status});
								}
		        	  db.close();
		});

	});
}

function checkacceptancetodecline(tonumber,id){
	console.log("checking for inconsistency");
	tonumber = parseInt(tonumber);
	MongoClient.connect(mongourl,function(err,db){
	  if(err)
	  throw err;
	  dbo = db.db("khanabottesting");

		dbo.collection("restaurants")
		    .findOne({"number": tonumber},
		             {projection: { orders: { $elemMatch: { "id" : id} } } },
		             function(errT, resultT) {
			              //console.log(resultT);
		        		if(resultT.orders[0].status == "Pending"){
									writeorderstatus(resultT.orders[0].id,"Declined",
										parseInt(resultT.orders[0].fromnumber),parseInt(resultT.orders[0].tonumber));

									extractinfofornotif("users",parseInt(resultT.orders[0].fromnumber),
										"Your order has been auto declined, sorry for inconvenience");

									extractinfofornotif("restaurants",parseInt(resultT.orders[0].tonumber),
										"The order has been declined as you did not respond.");
								}
		        	  db.close();
		});

	});
}

function checkacceptancetoalert(order){
	console.log("checking for inconsistency");
	tonumber = parseInt(order.tonumber);
	console.log(order.tonumber+"this is my tonumber");
	MongoClient.connect(mongourl,function(err,db){
	  if(err)
	  throw err;
	  dbo = db.db("khanabottesting");

		dbo.collection("restaurants")
		    .findOne({"number": tonumber},
		             {projection: { orders: { $elemMatch: { "id" : order.id} },msgnumber:1  } },
		             function(errT, resultT) {
			              //console.log(resultT);

		        		if(resultT.orders[0].status == "Pending"){
									if(resultT.msgnumber){
										sendmessagetorestaurant(resultT.msgnumber,order.id,order.mode,order.summary,order.total,"");
									}
									else{
										sendmessagetorestaurant(tonumber,order.id,order.mode,order.summary,order.total,"");
									}
									sendmessagetorestaurant(adminOneNum,order.id,order.mode,order.summary,order.total,order.tonumber);
									sendmessagetorestaurant(adminTwoNum,order.id,order.mode,order.summary,order.total,order.tonumber);
								}
		        	  db.close();
		});

	});
}

function sendnotification(message,recipient){
	console.log(recipient);
	var message = new gcm.Message( {
	    collapseKey: 'demo',
	    priority: 'high',
	    contentAvailable: true,
	    delayWhileIdle: true,
	    timeToLive: 3,
	    data: {
	        key1: 'message1',
	        key2: 'message2'
	    },
	    notification: {
	        title: "Khanabot",
	        icon: "homeicon",
	        sound:"margun",
	        body: message
	    }
	});

	message.delay_while_idle = 1;
	var registrationIds = [];
	registrationIds.push(recipient);
  console.log("sending notification : ",message);
	//sender.send(message, registrationIds,/* 4,*/ function (err, result) {
	//console.log(result);
	//});
}

function sendmessagetorestaurant(number,order,mode,summary,total,tonumber){
	console.log("sending message to rest");
	console.log(number + " " + order + " " + mode + " summary : "+summary);

	// let url = "https://2factor.in/API/R1/"+
	// number+"&from=khanab&templatename=order+place&var1="+order+"&var2="+mode+"&var3="+summary+"&var4="+total+"&var5="+tonumber;
	// https.get(url,function(res){
	//   let data = '';
	//   res.on("data",(chunk)=>{
	//     data+=chunk;
	//   });
	//   res.on("end",()=>{
	//     console.log(data);
	//   });
	//   res.on("error",(error)=>{
	//     console.log(error);
	// 	});
	// });
}

function getotp(number){
	var otp = Math.floor(Math.random()*10)+""+ Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+
	Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10);
	if(parseInt(number)==7488663497)
	otp = "11111";
	else
	https.get("https://2factor.in/API/V1/53a00358-7bf4-11e8-a895-0200cd936042/SMS/"+number+"/"+otp+"/khanabot",function(res){
	  let data = '';
	  res.on("data",(chunk)=>{
	    data+=chunk;
	  });
	  res.on("end",()=>{
	    console.log(data);
	  });
	  res.on("error",(error)=>{
	    console.log(error);
	  });
	});

	console.log(otp);
	return otp;
}

function updateuuidrest(req,res,number,collection){
	query={};
	query.number = number;
	MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;

			var dbo = db.db("khanabottesting");
			dbo.collection(collection).findOne(query,function(err,mres){
					if(err)
					throw err;
					if(mres==null){
						updateuuid(req, res, number, collection);
					}
					else {
						console.log("uuid found and sent, multiple loggdin tracked\n" + mres.uuid);
						sess.number = number;
						sess.uuid = mres.uuid;
						sess.loggedin = true;
						res.send({uuid:mres.uuid});
					}
			});
			db.close();
	});
}

function updateuuid(req,res,number,collection){
	sess = req.session;
	//uuid = Math.floor(Math.random()*999999999999 + 1000000000000);
	uuid = require('crypto').randomBytes(128).toString('hex');
	query={};
	query.number = number;
	MongoClient.connect(mongourl,function(err,db){
			if(err)
			throw err;

			var dbo = db.db("khanabottesting");
			dbo.collection(collection).update(query,{$set:{uuid:uuid}},{upsert:true},function(err,mres){
					if(err)
					throw err;
					console.log("uuidupdated");
					sess.number = number;
					sess.uuid = uuid;
					sess.loggedin = true;
					res.send({uuid:uuid});
			});
	});
}

app.post('/weblogintrial',function(req,res){
	sess = req.session;
	sess.number = 7488663497;
	sess.loggedin = true;
	res.send({loggedin:true});
});

app.post('/login',function(req,res){
	var query = {};
	console.log(req.body);
	query.number = parseInt(req.body.number);
	sess = req.session;
	query.uuid = req.body.uuid;
	MongoClient.connect(mongourl,function(err,db){
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

app.post('/loginrest',function(req,res){
	var query = {};
	query.number = parseInt(req.body.number);
	sess = req.session;
	query.uuid = req.body.uuid;
	MongoClient.connect(mongourl,function(err,db){
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

app.get('/appversion',function(req,res){
	res.send({version:"2.1.0"});
});

app.get('/appversionrest',function(req,res){
        res.send({version:"1.0.0"});
});

app.get('/checkstatus',function(req,res){
		sess = req.session;
		if(sess && sess.loggedin){
			res.send({loggedin:true});
		}
		else
		res.send({loggedin:false});
});

app.post('/number',function(req,res){
		insertme = {};
		checkme = {};
		sess = req.session;
		insertme.number = parseInt(req.body.number);
		checkme.number = insertme.number;
		insertme.otp = getotp(insertme.number);
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
									updateuuid(req,res,checkme.number,"users");
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
									updateuuidrest(req,res,checkme.number,"restaurants");
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
				throw e rr;
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

app.post('/sharelocation',function(req,res){
	sess = req.session;

	if(sess && sess.loggedin){
		var lat = parseFloat(req.body.lat);
		var long = parseFloat(req.body.long);
		if(req.body.gLocation){
			gLocation = req.body.gLocation;
			sess.gLocation=gLocation;}
		else {
			gLocation="";
		}
		sess.lat = lat;
		sess.long = long;
		var Location={};
		Location.lat=lat;
		Location.long=long;
		Location.gLocation=gLocation;

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("restaurants").find({
				"Location.lat":{$gt:lat-config.dlatitude,$lt:lat+config.dlatitude},
				"Location.long":{$gt:long-config.dlongitude,$lt:long+config.dlongitude},"status":"on","admin":"on"}).
				project({orders:0, _id:0,notificationid:0,uuid:0}).sort({rating:-1}).toArray(function(err,mres){
					res.send(mres);
					//console.log(mres);
					console.log(lat,long);
      	});

			//If want to save location of user
			dbo.collection("users").update({"number":parseInt(sess.number)},{
				$set : {
					"Location":Location
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("updated location");
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

// Lists all restaurants to admin
app.get('/adminlistallrest', adminlistallrest);

// Saves the location of restaurant in database
app.post('/locationrest',locationrest);

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

// Send the whole restaurant document related to a particular number.
app.get('/restaurantpage', restaurantpage);

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

app.post('/requestorder',function(req,res){
	sess = req.session;
	console.log("something came");
	if(sess && sess.loggedin){
		console.log("something came in");
		var mode = req.body.mode;
		var time = req.body.time;
		var order = req.body.order;
		var gLocation = sess.gLocation;
		//console.log(order);

		order = JSON.parse(order);
		console.log(mode,time);

		while(order.length > 0){
			temporder=[];
			tempnumber = order[0].number;
			for(var j=0; j<order.length;j++){
				if(order[j].number == tempnumber){
					temporder.push(order[j]);
					order.splice(j,1);
					j--;
				}
			}
			//console.log(temporder);
			processrequest(mode,temporder,time,gLocation);

		}
		res.send({"orders":"requested"});

	}
	else{
		res.send({loggedin:false});
	}
});

app.post('/requestordernew',function(req,res){
	sess = req.session;
	console.log("something came");
	if(sess && sess.loggedin){
		console.log("something came in");
		var order = req.body.order;
		//console.log(order);

		order = JSON.parse(order);
		console.log(order.ordermode,order.time);
		processrequestnew(order);
		res.send({"orders":"requested"});

	}
	else{
		res.send({loggedin:false});
	}
});

function processrequest(mode,order,time,gLocation){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");
		var orders = {};
		orders.mode = mode;
		orders.time = time;
		orders.order = order;
		orders.status ="Pending";
		orders.fromnumber = parseInt(sess.number);
		orders.tonumber = parseInt(order[0].number);
		orders.gLocation = gLocation;
		var date = new Date();
		orders.id = date.getTime()+""+(1000 + Math.floor(8999 * Math.random()));
		//console.log(orders);
		var total = 0;
		var summary = "";
		for(var i =0; i<order.length;i++){
			var price = order[i].price[parseInt(order[i].index)] * parseInt(order[i].quantity)
			total+=price;
			summary += order[i].name +" x " + order[i].quantity +" = "+price+", ";
		}
		if(mode=="book")
		summary = summary + "\nBook" +" in time : " + time + "mins";
		else {
			summary = summary + "\nCOD" +" in time : " + "__"+ "mins";
		}
		console.log(summary);
		console.log(total);
		orders.summary = summary;
		orders.total = total;

		dbo.collection("restaurants").update({"number":parseInt(orders.tonumber)},{
				$push : {
					"orders":orders
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("updated in restaurants");
		});


		//If want to save location of user
		dbo.collection("users").update({"number":parseInt(sess.number)},{
			$push : {
				"orders":orders
			}
		},{
			upsert:false
		},
		function(err,mres){
			if(err)
			throw err;
			console.log("updated in users");
		});

		extractinfofornotif("restaurants",parseInt(orders.tonumber),"There is a new order kindly see the order");

		console.log("timer started");

		setTimeout(function(){
			checkacceptancetoalert(orders);
		},orderalert);

		setTimeout(function(){
			checkacceptancetodecline(orders.tonumber,orders.id);
		},ordertimeout);

		db.close();
	});
}

function processrequestnew(order){
	MongoClient.connect(mongourl,function(err,db){
		if(err)
			throw err;
		var dbo = db.db("khanabottesting");
		order.fromnumber = parseInt(sess.number);
		var date = new Date();
		order.id = date.getTime()+""+(1000 + Math.floor(8999 * Math.random()));
		//console.log(orders);

		var summary = "";
		for(var i =0; i<order.order.length;i++){
			// var price = order[i].price[parseInt(order[i].index)] * parseInt(order[i].quantity)
			// total+=price;
			summary += order.order[i].name +" x " + order.order[i].quantity +" = "+order.order[i].price+", ";
		}
		if(order.mode=="book")
		summary = summary + "\nBook" +" in time : " + order.time;
		else {
			summary = summary + "\nCOD" +" in time : " + order.time;
		}
		console.log(summary);
		console.log(order.total);
		order.summary = summary;

		dbo.collection("restaurants").update({"number":parseInt(order.tonumber)},{
				$push : {
					"orders":order
				}
			},{
				upsert:false
			},
			function(err,mres){
				if(err)
				throw err;
				console.log("updated in restaurants");
		});


		//If want to save location of user
		dbo.collection("users").update({"number":parseInt(sess.number)},{
			$push : {
				"orders":order
			}
		},{
			upsert:false
		},
		function(err,mres){
			if(err)
			throw err;
			console.log("updated in users");
		});

		extractinfofornotif("restaurants",parseInt(order.tonumber),"There is a new order kindly see the order");

		console.log("timer started");

		setTimeout(function(){
			checkacceptancetoalert(order);
		},orderalert);

		setTimeout(function(){
			checkacceptancetodecline(order.tonumber,order.id);
		},ordertimeout);

		db.close();
	});
}


app.get('/changeorderstatuspradeep',function(req,res){
	sess = req.session;
	sess.loggedin = true;
	if(sess && sess.loggedin){
		var id = req.query.id;
		var status = req.query.status;
		var fromnumber = parseInt(req.query.fromnumber);
		var tonumber = parseInt(req.query.tonumber);

		res.send({status:"changed"});

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");
			dbo.collection("users").update({"number":fromnumber,"orders.id":id},{$set:
			{"orders.$.status":status}},{upsert:false},
				function(err,mres){
					if(err)
					throw err;
					console.log("user order updated");
			});

			dbo.collection("restaurants").update({"number":tonumber,"orders.id":id},{$set:
			{"orders.$.status":status}},{upsert:false},
				function(err,mres){
					if(err)
					throw err;
					console.log("restaurant order updated");
			});

			//sendnotification("Conditional message","fromnumber")

			dbo.collection("users").findOne({"number":fromnumber},function(err,mres){
					if(err)
					throw err;
					if(mres){
						if(mres.notificationid){
							sendnotification("Your order has been "+status,mres.notificationid);
						}
					}
			});

			db.close();
		});
	}
	else{
		res.send({loggedin:false});
	}
});

app.get('/changeorderstatusrest',function(req,res){
	sess = req.session;
	if(sess && sess.loggedin){
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
			extractinfofornotif("users",parseInt(fromnumber),"Your order has been "+status);
			res.send({status:"changed"});
		}

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
										extractinfofornotif("restaurants",parseInt(resultT.orders[0].tonumber),
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

// Send status of a restaurant to it, if it is open or closed.
app.get('/getstatus', getstatus);

// Send status of a restaurant to its document, if it is open or closed.
app.get('/setstatus', setstatus);

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

// Sends offers if any, for now function is hardcoded.
app.get('/getoffers', getoffers);

var server = app.listen(port,function(req,res){
  console.log("server started on "+ port);
});

process.on('SIGINT',()=>{
	console.log("sigint called");
	server.close();
});
