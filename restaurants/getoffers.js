// Sends offers if any, for now is hardcoded.

function getoffers (req, res){
	var number = parseInt(req.query.number);
	if(true || number == "9956837774"){
		var offers = [{name:"OFF15",minValue:150,maxDiscount:-1,mode:["book"]},
		{name:"OFF10",minValue:100,maxDiscount:-1}];
		res.send(offers);
	}
	else{
		res.send([]);
	};
};

module.exports = getoffers;