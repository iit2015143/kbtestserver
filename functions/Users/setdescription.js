// Set user description in mongoose document

const mongoose = require('mongoose');
var constants = require('../../kbdelicates/constants.js');
var mongourl = constants.mongourl;
const userModel = require('../../Models/user.js')

function setdescription(req, res) {
	sess = req.sess;
	if(sess && sess.loggedin){
		var number = parseInt(sess.number);
		var description = req.query.description;

		mongoose.connect('mongodb://localhost/khanabottesting', {useNewUrlParser: true});
		var db = mongoose.connection;
		db.on('error', () => {res.send({status: "error"})});
		db.once('open', function () {
			userModel.findOne({number: number}, function (err, doc) {
				doc.description = description;
				doc.save();
				res.send({status: "done"});
			});
		});
	}
	else {
		res.send({status: "logged out"});
	};
};

module.exports = setdescription;