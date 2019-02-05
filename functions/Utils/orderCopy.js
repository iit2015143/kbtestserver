//const {mongoose}=require('./config/mongoose');
const MongoClient=require('mongodb').MongoClient;
const constants = require('../../kbdelicates/constants');
const mongourl = constants.mongourl;

const orderCopy=() => {
  MongoClient.connect(mongourl,{ useNewUrlParser: true },async function(err,db){
      if(err)
        throw err;
      const dbo = db.db("khanabottesting");
      const orders=[];

      const rests=await dbo.collection("restaurants").find({}).toArray();
      rests.map((res) => orders.push(...res.orders));
      //console.log(orders.length);

      await dbo.collection("orders").remove({});
      await dbo.collection("orders").insertMany(orders);

      db.close();
  });
  console.log("Done");
}

module.exports= orderCopy ;
