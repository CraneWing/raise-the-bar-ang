var jwt = require('jwt-simple');
var moment = require('moment');

var User = require('../models/user');
var keys = require('../config/keys');

var middleware = {};

// object properties are expires, issued at and 
// subject. email or user.id comment for subject.
middleware.createToken = function(user) {
	var payload = {
		exp: moment().add(14, 'days').unix(),
		iat: moment().unix(),
		sub: user._id
	};

	return jwt.encode(payload, keys.local.tokenSecret);
};

// protect routes from users not logged in
middleware.isAuthenticated = function(req, res, next) {
	if (!(req.headers && req.headers.authorization)) {
		return res.status(400).send({
			message: 'You did not provide a JSON web token in the authorization header'
		});
	}

	var header = req.headers.authorization.split(' ');
	var token = header[1];
	var payload = jwt.decode(token, keys.local.tokenSecret);
	var now = moment().unix();

	if (now > payload.exp) {
		return res.status(400).send({
			message: 'Token has epxired'
		});
	}

	User.findById(payload.sub, function(error, user) {
		if (!user) {
			return res.status(400).send({
				message: 'Sorry, that user no longer exists'
			});
		}

		req.user = user;
		next();
	});
};

module.exports = middleware;