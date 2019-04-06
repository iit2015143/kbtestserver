// Give admin all the rights that a restaurant admin has by just setting session as a restaurant session.

function getmerest (req,res){
	sess = req.session;
		var number = parseInt(req.body.number);
		sess.number = number;
		res.send({status:"done"});
}

module.exports = getmerest;