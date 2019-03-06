const MongoClient=require('mongodb').MongoClient;
const constants = require('../../kbdelicates/constants');
const mongourl = constants.mongourl;

const geoLocationFilter = () =>{
  MongoClient.connect(mongourl,{useNewUrlParser : true},async (err ,db) => {
    if(err)
      throw err;
    const dbo = db.db("khanabottesting");
    dbo.collection('restaurants').createIndex({location : "2dsphere"});
    dbo.collection('restaurants').find({},function(err,results){
      results.forEach((item) =>{
        dbo.collection('restaurants').updateOne({_id : item._id},{$set : {location : {type : "Point", coordinates : [item.Location.long, item.Location.lat] }}});
      });
    });
  });
}
const findLocationWise = async (long,lat,res) =>{
  MongoClient.connect(mongourl,{useNewUrlParser : true},async (err ,db) => {
    if(err)
      throw err;
    const dbo = db.db("khanabottesting");
    var t = dbo.collection('restaurants').find(
   {
     location: {
        $nearSphere: {
           $geometry: {
              type : "Point",
              coordinates : [ long, lat ]
           },
           $minDistance: 0,
           $maxDistance: 5000
        }
     }
   }
);
var arr  = async (t) => {return t.toArray()}
var as = await arr(t);
res.send(as);
  });
}

module.exports = {
  //geoLocationFilter,  //uncomment for using
  findLocationWise
};
