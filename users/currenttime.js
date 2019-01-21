// Send current time to everyone who makes request.

function currenttime (req,res){
	let date = new Date();
	date = date.getHours();
	res.send({currenttime:date});
};

module.exports = currenttime;