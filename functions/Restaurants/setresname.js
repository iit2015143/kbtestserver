// Set restaurant name in mongoose document

const mongoose = require('mongoose');
var constants = require('../../kbdelicates/constants.js');
var mongourl = constants.mongourl;
const restaurantModel = require('../../Models/restaurant.js')

function setresname(req, res) {
	var number = parseInt(sess.number);
	var resname = req.query.resname;

	mongoose.connect('mongodb://localhost/khanabottesting', {useNewUrlParser: true});
	var db = mongoose.connection;
	db.on('error', () => {res.send({status: "error"})});
	db.once('open', function () {
		restaurantModel.findOne({number: number}, function (err, doc) {
			doc.name = resname;
			doc.save();
			res.send({status: "done"});
		});
	});
};

module.exports = setresname;