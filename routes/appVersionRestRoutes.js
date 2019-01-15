/*============================================================================================
                    Tests the user app version for playstore redirection.
==============================================================================================*/

const router = require('express').Router();

router.get('/',function(req,res){
	res.send({version:"1.0.0"});
});

module.exports = router;
