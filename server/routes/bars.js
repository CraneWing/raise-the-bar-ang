var express = require('express');
var router = express.Router();

var Yelp = require('yelp');

var keys = require('../config/keys.js');

var yelp = new Yelp({
	consumer_key: keys.yelp.consumerKey,
	consumer_secret: keys.yelp.consumerSecret,
	token: keys.yelp.token,
	token_secret: keys.yelp.tokenSecret
});

// return search results for all arae bars
router.post('/', function(req, res, next) {
	// node-yelp method to get results by term
	yelp.search({
		term: 'bars',
		limit: 20,
		offset: 20,
		sort: 2,
		location: req.query.location,
		radius_filter: 32186.9
	})
	.then(function(results) {
		//console.log(results);
		res.json(results);
	})
	.catch(function(error) {
		console.log(error);
	});
});

module.exports = router;