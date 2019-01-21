/*============================================================================================
                  Tests the restaurant app version for playstore redirection.
==============================================================================================*/

const router = require('express').Router();

router.get('/',function(req,res){
	res.send({version:"2.1.0"});
});

module.exports = router;
