var gcm = require('node-gcm');
var url = require("../config/keys").url;
var adminOneNum=7488663497;
var adminTwoNum=9807666322;
var port = 8000;
var mongourl = url;
var sender = {};
var ordertimeout = 1320000;
var orderalert = 120000;


module.exports={
  adminOneNum,
  adminTwoNum,
  port,
  mongourl,
  sender,
  ordertimeout,
  orderalert
};
