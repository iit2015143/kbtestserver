//Asks number from user and sends an otp to user

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;
const getotp=require('../Utils/OtpReturn');

const otpUser=(req,res) => {
  const insertme = {};
  const checkme = {};
  const sess = req.session;
  insertme.number = parseInt(req.body.number);
  checkme.number = insertme.number;
  insertme.otp = getotp(insertme.number);
  const date = new Date();
  insertme.date = date.getTime();
  console.log(insertme);
  MongoClient.connect(mongourl,function(err,db){
      if(err)
      throw err;
      const dbo = db.db("khanabottesting");

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

}

module.exports=otpUser;
