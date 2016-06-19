var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
	twitter_id: {
		type: String,
		index: true
	},
	username: {
		type: String,
		unique: true
	},
	password: {
		type: String,
		select: false
	},
	display_name: {
		type: String
	},
	profile_img: String,
	user_created_at: {
		type: Date,
		default: Date.now
	}
});

userSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

module.exports = mongoose.model('User', userSchema);