//Checks otp entered for its validity.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;
const updateuuid=require('../Utils/Updateuuid');

const otpUserValidity=(req,res) => {
  const checkme={};
  const sess = req.session;
  checkme.number = parseInt(sess.number);
  checkme.otp = req.body.otp;
  let date = new Date();
  date = date.getTime();
  //console.log(checkme);
  MongoClient.connect(mongourl,function(err,db){
      if(err)
      throw err;

      const dbo = db.db("khanabottesting");
      console.log("db taken");
      dbo.collection("usersotp").findOne(checkme,function(err,mres){
        console.log(mres);
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

}

module.exports=otpUserValidity;
