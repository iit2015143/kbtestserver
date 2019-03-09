//Checks otp entered for its validity.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;

const updateuuidRest=require('../Utils/UpdateuuidRest');

const otpRest=(req,res) => {
  const checkme={};
  const sess = req.session;
  //console.log(sess.number);
  checkme.number = parseInt(sess.number);
  checkme.otp = req.body.otp;
  let date = new Date();
  date = date.getTime();
  console.log(checkme);
  MongoClient.connect(mongourl,function(err,db){
      if(err)
      throw err;

      const dbo = db.db("khanabottesting");
      console.log("db taken");
      dbo.collection("usersotp").findOne(checkme,function(err,mres){
          if(err)
          throw err;

          if(mres == null)
          res.send({otp:"invalid"});
          else{
            if(date - mres.date <=180000){
                updateuuidRest(req,res,checkme.number,"restaurants");
            }
            else {
              res.send({otp:"timeout"});
            }
          }
          db.close();
          console.log("db closed");
      });
  });
}

module.exports=otpRest;
