// Lists all restaurants to admin

function adminlistallrest (req,res){

	sess = req.session;
	sess.loggedin = true;

	if(sess && sess.loggedin){

		MongoClient.connect(mongourl,function(err,db){
			if(err)
				throw err;
			var dbo = db.db("khanabottesting");

			dbo.collection("restaurants").find({}).
				project({number:1,name:1}).toArray(function(err,mres){
					res.send(mres);
					//console.log(mres);
      			});

			db.close();
		});
	};
	else{
		res.send({loggedin:false});
	};
};

module.exports = adminlistallrest;