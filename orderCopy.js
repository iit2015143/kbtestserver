const mongoose=require('mongoose');
const MongoClient=require('mongodb').MongoClient;
const constants = require('./kbdelicates/constants');
const mongourl = constants.mongourl;
const {Order}=require('./Models/Orders');

const copyOrder=async () => {
  const orders=[];
  MongoClient.connect(mongourl,function(err,db){
    if(err)
      throw err;
    const dbo = db.db("khanabottesting");

  const arr=  dbo.collection("restaurants").find({}).toArray();
  console.log(arr);
  })
  // Order.remove({}).then(() => {
  //
  // })
}

copyOrder();
