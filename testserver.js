var http = require("http");
var https = require("https");
var gcm = require('node-gcm');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var session = require('express-session');
//Thus reads configuration of restaurant distance where it will deliver food
var readConfig = require('./readConfig');

// all admin only functions
var getmerest = require('./functions/adminonly/getmerest.js');


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

// all restaurant related functions
var getoffers = require('./functions/Restaurants/getoffers.js');
var adminlistallrest = require('./functions/Restaurants/adminlistallrest.js');
var locationrest = require('./functions/Restaurants/locationrest.js');
var restaurantpage = require('./functions/Restaurants/restaurantpage.js');
var getstatus = require('./functions/Restaurants/getstatus.js');
var setstatus =require('./functions/Restaurants/setstatus.js');
var setmsgnumber = require('./functions/Restaurants/setmsgnumber.js');
var setcallnumber = require('./functions/Restaurants/setcallnumber.js');
var getmsgnumber = require('./functions/Restaurants/getmsgnumber.js');
var getcallnumber = require('./functions/Restaurants/getcallnumber.js');

// all user related functions
var addtocart = require('./functions/Users/addtocart.js');
var currenttime = require('./functions/Users/currenttime.js');
var profilepage = require('./functions/Users/profilepage.js');
var savelocation = require('./functions/Users/savelocation.js');
var savenotificationidrest = require('./functions/Users/savenotificationidrest.js');

// Function modules
var checkandwrite = require('./functions/checkAndWrite');
var getotp = require('./functions/getOTP');
var processrequestnew = require('./functions/processRequestNew');
var sendnotification = require('./functions/sendNotification');
var updateuuid = require('./functions/updateUUID');
var updateuuidrest = require('./functions/updateUUIDRest');

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

const mongoose = require('mongoose');

mongoose.connect(mongourl,{useNewUrlParser : true});
mongoose.connection.once('open',function(){
  console.log("Connected");
}).on('error',function(error){
  console.log('Error : ' ,error);
}).then(() => {
	const {/*geoLocationFilter,uncomment to use*/findLocationWise} = require('./functions/Restaurants/geoLocationFilter');
//	geoLocationFilter();

  	//all path to server

	// Save notification id of a user
	app.get('/savenotificationidrest', savenotificationidrest);

	// Give admin all the rights that a restaurant admin has by just setting session as a restaurant session.
	app.post('/getmerest', getmerest);

	// Lists all Restaurants to admin
	app.get('/adminlistallrest', adminlistallrest);

	// Saves the location of restaurant in database
	app.post('/locationrest',locationrest);

	// Save location (but function not used for now)
	app.get('/savelocation', savelocation);

	// Send the whole restaurant document related to a particular number.
	app.get('/restaurantpage', restaurantpage);

	// Send the whole user document related to a particular number.
	app.get('/profilepage', profilepage);

	// Save user cart to user document for now not in use.
	app.get('/addtocart', addtocart);

	// Send status of a restaurant to it, if it is open or closed.
	app.get('/getstatus', getstatus);

	// Send status of a restaurant to its document, if it is open or closed.
	app.get('/setstatus', setstatus);

	// Set message number to restaurant document.
	app.get('/setmsgnumber', setmsgnumber);

	// Set call number to restaurant document.
	app.get('/setcallnumber', setcallnumber);

	// Send current time to everyone who makes request.
	app.get('/currenttime', currenttime);

	// Sends offers if any, for now function is hardcoded.
	app.get('/getoffers', getoffers);

	// Get message number from restaurant document.
	app.get('/getmsgnumber', getmsgnumber);

	// Get call number from restaurant document.
	app.get('/getcallnumber', getcallnumber);

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

	//Copy all orders from restaurants collection to orders collection
	 const orderCopy=require('./functions/Utils/orderCopy');
	orderCopy();
});

var server = app.listen(port,function(req,res){
  console.log("server started on "+ port);
});

process.on('SIGINT',()=>{
	console.log("sigint called");
	server.close();
});
