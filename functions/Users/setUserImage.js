const MongoClient=require('mongodb').MongoClient;
const constants=require('../../kbdelicates/constants');
const mongourl=constants.mongourl;

const setUserImage=(req,res) => {
    const number=req.body.number;
    const imgname=req.body.imgname;

    MongoClient.connect(mongourl,(err,db) => {
        if(err) throw err;
        const dbo=db.db("khanabottesting");


        try{
            dbo.collection("users").update({"number":number},
            {$set:{
                "userimg":imgname
            }});

            res.send("User image updated.")
            
        }catch(err){
            throw err;
        }

        db.close();
    })
}

module.exports=setUserImage;