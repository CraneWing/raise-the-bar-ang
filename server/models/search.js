var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchSchema = new Schema({
	term: String,
	user_id: String,
	bars: [{
		_id: String,
		name: String,
		location: {
			address: [String],
			city: String,
			state_code: String,
			postal_code: String
		},
		phone: String,
		image_url: String,
		snippet_text: String,
		categories: [String],
		url: String,
		rating: Number,
		guests: {
			type: Number,
			default: 0
		}
	}]
});

module.exports = mongoose.model('Search', searchSchema);