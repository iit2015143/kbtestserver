const mongoose=require('mongoose');

const RestaurantSchema = new mongoose.Schema({
	number: {
		type: Number,
		required: true
	},
	Location: [{
		lat: {
			type: Number
		},
		long: {
			type: Number
		}
	}],
	name: {
		type: String
	},
	rating: {
		type: Number
	},
	HotDeals: {
		type: Array
	},
	TopRated: {
		type: Array
	},
	notificationid: {
		type: String
	},
	availability: [{
		uptime: {
			type: Number
		},
		downtime: {
			type: Number
		}
	}],
	image: {
		type: String  // check
	},
	Offers: {
		type: Array
	},
	uuid: {
		type: String
	},
	status: {
		type: String
	},
	admin: {
		type: String
	},
	msgnumber: {
		type: Number
	}
});

const Restaurant = mongoose.model('restaurants', RestaurantSchema);
module.exports = Restaurant;