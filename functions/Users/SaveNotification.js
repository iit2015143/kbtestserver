//Save notificaionid of a user.

var MongoClient = require('mongodb').MongoClient;
var constants = require('../../kbdelicates/constants.js');
const mongourl=constants.mongourl;

const saveNotificationID=(req,res) => {
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

module.exports=saveNotificationID;
