var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	password: {
		type: String
	},
	display_name: {
		type: String
	},
	user_created_at: {
		type: Date,
		default: Date.now
	},
	searches: [{
		search_term: String,
		created_at: {
			type: Date,
			default: Date.now()
		}
	}],
	going_to: [{
		location: String,
		count: Number
	}],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);