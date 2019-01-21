/*============================================================================================
                  			Checks whether a user is logged in or not.
==============================================================================================*/

const router = require('express').Router();

router.get('/',function(req,res){
		sess = req.session;
		if(sess && sess.loggedin){
			res.send({loggedin:true});
		}
		else{
			res.send({loggedin:false});
		}
});

module.exports = router;
