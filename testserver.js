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
const otpUser=require('./functions/Users/OtpUser');
const otpRestValidity=require('./functions/Restaurants/OtpRestValidity');
const otpUserValidity=require('./functions/Users/OtpUserValidity');
const logoutSession=require('./functions//Utils/LogoutSession');
const saveNotificationID=require('./functions/Users/SaveNotification');
const orderStatusCustomer=require('./functions/Restaurants/OrderStatusCustomer');
const writeorderstatus=require('./functions/Users/WriteOrderStatus');
const updatedatabasefordeclined=require('./functions/Utils/UpdateDatabaseDeclined');
const extractinfofornotif=require('./functions/Utils/ExtractInfoNotif');
const orderHistory=require('./functions/Users/OrderHistory');
const orderHistoryRest=require('./functions/Restaurants/OrderHistoryRest');

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

var sess;

//Asks number from user and sends an otp to user
app.post('/number',otpUser);

//Checks otp entered for its validity.
app.post('/otp',otpUserValidity);

//Checks otp entered for its validity.
app.post('/otprest',otpRestValidity);

//Logs a user out temporarily.
app.get('/logout',logoutSession);

//Save notificaionid of a user
app.get('/savenotificationid',saveNotificationID);

//Changes status of order and is exercised by user.
app.get('/changeorderstatuscustomer',orderStatusCustomer);

//Sends orderhistory of a user and is capped by a specific limit.
app.get('/orderhistory',orderHistory);

//Sends orderhistory of a restaurant and is capped by a specific limit.
app.get('/orderhistoryrest',orderHistoryRest);

var server = app.listen(port,function(req,res){
  console.log("server started on "+ port);
});

process.on('SIGINT',()=>{
	console.log("sigint called");
	server.close();
});
