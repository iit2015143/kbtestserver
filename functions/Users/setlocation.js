// Set location in mongoose document

const mongoose = require('mongoose');
var constants = require('../../kbdelicates/constants.js');
var mongourl = constants.mongourl;
const userModel = require('../../Models/user.js')

function setlocation(req, res) {
	var number = parseInt(sess.number);
	var lat = req.query.lat;
	var long = req.query.long;

	mongoose.connect('mongodb://localhost/khanabottesting', {useNewUrlParser: true});
	var db = mongoose.connection;
	db.on('error', () => {res.send({status: "error"})});
	db.once('open', function () {
		userModel.findOne({number: number}, function (err, doc) {
			doc.Location.lat = lat;
			doc.Location.long = long;
			doc.save();
			res.send({status: "done"});
		});
	});
};

module.exports = setlocation;