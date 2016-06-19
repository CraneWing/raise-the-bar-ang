var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchSchema = new Schema({
	term: String,
	user_id: String,
	reservations: [{
		bar_id: String,
		going: Number
	}]
});

module.exports = mongoose.model('Search', searchSchema);