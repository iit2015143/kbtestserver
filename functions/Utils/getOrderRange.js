const MongoClient=require('mongodb').MongoClient;
const constants=require('../../kbdelicates/constants');
const mongourl=constants.mongourl;

const getOrderRange=(req,res) => {
    const number=req.body.number;
    const start=req.body.start;
    const end=req.body.end;

    MongoClient.connect(mongourl,{ useNewUrlParser: true },async (err,db) => {
        if(err) throw err;

        const dbo=db.db("khanabottesting");

        try{
            const orders=await dbo.collection("orders").find({"fromnumber":number}).toArray();
            const len=orders.length;


            if(start>end){
                res.end("Start cannot be greater than end.")
            }
            
            else if(start>len)
                res.send("Start index is greater than the number of orders of this particular user.")
            else if(end>len){
                res.send(orders.slice(start-1,len));
            }
            
            else{
                res.send(orders.slice(start-1,end));
            }

        }catch(err){
            throw err;
        }
        
        db.close();
    });
}

module.exports=getOrderRange;