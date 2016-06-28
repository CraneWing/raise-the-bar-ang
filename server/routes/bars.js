var express = require('express');
var router = express.Router();
var Yelp = require('yelp');
var async = require('async');

var Reservation = require('../models/reservation');

var keys = require('../config/keys.js');

var yelp = new Yelp({
	consumer_key: keys.yelp.consumerKey,
	consumer_secret: keys.yelp.consumerSecret,
	token: keys.yelp.token,
	token_secret: keys.yelp.tokenSecret
});

// return search results for all arae bars
router.post('/', function(req, res, next) {
	// for uniformity of search terms, converted to
	// lowercase and all commas are stripped out. rationale for this
	// is to handle "Warren, MI", "Warren MI", "warren mi" and avoid
	// duplicates in search collection in DB.
	var location = req.query.location.replace(/,/g, '').toLowerCase();
	// user ID will be key to link searches to users
	var userId = req.query.userId;
	// searches are saved only if a user is logged in
	var signedIn = req.query.signedIn;
	// to save raw JSON so data can be passed to other functions.
	var barData = [];
	var reservations = {};
	
	// node-yelp method to get results by term
	yelp.search({
		term: 'bars',
		limit: 20,
		offset: 20,
		sort: 2,
		location: location,
		radius_filter: 32186.9
	})
	.then(function(results) {
	  barData = results.businesses;
	  // console.log(barData);
		// if search by authenticated user, need
		// to save it to DB
		if (signedIn && userId !== 'none') {
			console.log('user is authenticated');
			// query each bar to see if it has reservation
			async.map(barData, function(bar, callback) {
				
				Reservation.findOne({
					user_id: userId,
					bar_id: bar.id 
				}, function(error, rez) {
					
					if (rez) {
						console.log('user has reservation at ' + bar.id);
						reservations[bar.id] = 1;
					  callback(null, {});
						
					}
					else {
						console.log('no reservation at ' + bar.id);
						reservations[bar.id] = 0;
						callback(null, {});
					}
				});
			}, function(error, results) {
				res.status(200).json({
					bars: barData,
					reservations: reservations
				});
			});
		}
	})
	.catch(function(error) {
		console.log(error);
	});
}); // router.post

// update a reservation
router.post('/create', function(req, res, next) {
	var barId = req.body.bar_id;
	var userId = req.body.user_id;
	
	console.log('reservation to be added for bar ' + barId + ' and user ' + userId);
	
	var newRez = new Reservation({
		 user_id: userId,
		 bar_id: barId,
		 guests: 1
	});
		
	newRez.save(function(error) {
		if (error) res.send(error);
		res.send({
			message: 'reservation for bar ' + barId + ' and user ' + userId + ' was saved!'
		});
	});

});
	
router.post('/delete', function(req, res) {
	var barId = req.body.bar_id;
	var userId = req.body.user_id;
	
	console.log('reservation to be deleted for bar ' + barId + ' and user ' + userId);
	
	Reservation.findOne({ 
		user_id: userId,
		bar_id: barId
		}, function(error, rez) {
			if (rez) {
				rez.remove(function(error) {
					if (error) res.send(error);
					
					res.status(200).json({
						message: 'reservation for bar ' + barId + ' and user ' + userId + ' was deleted'
					});
				});
			}
	});
});
	

module.exports = router;