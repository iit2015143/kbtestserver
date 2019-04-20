const MongoClient=require('mongodb').MongoClient;
const constants=require('../../kbdelicates/constants');
const mongourl=constants.mongourl;

const setResImage=(req,res) => {
    const number=req.body.number;
    const imgname=req.body.imgname;

    MongoClient.connect(mongourl,(err,db) => {
        if(err) throw err;
        const dbo=db.db("khanabottesting");


        try{
            dbo.collection("restaurants").update({"number":number},
            {$set:{
                "resimg":imgname
            }});

            res.send("Restaurant image updated.")
            
        }catch(err){
            throw err;
        }

        db.close();
    })
}

module.exports=setResImage;