const mongoose=require('mongoose');

const UserSchema = new mongoose.Schema({
	number: {
		type: Number,
		required: true
	},
	uuid: {
		type: String
	},
	Location: [{
		lat: {
			type: Number
		},
		long: {
			type: Number
		}, 
		gLocation: {
			type: String
		}}],
	notificationid: {
		type: String
	},
	order: {
		type: Array
	},
	username: {
		type: String
	},
	description: {
		type: String
	}
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
