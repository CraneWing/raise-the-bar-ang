var express = require('express');
var router = express.Router();
var Yelp = require('yelp');
var _ = require('lodash');

var Search = require('../models/search');

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
	var barData = {};
	var unsavedBars, savedBars;
	
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
	  barData = results;
	  // raw bar data, not saved to MongoDB
	  unsavedBars = barData.businesses;
	  //console.log(unsavedBars);
	  
		// if search by authenticated user, need
		// to save it to DB
		if (signedIn && userId !== 'none') {
			console.log('authenticated user exists!');
			// call function that determines if search is
			// new and must be saved or already exists.
			checkForOldOrNewSearch(location, unsavedBars, userId);
		}
		else { 
			// search was by non-authenticated user or user with
			// account who isn't signed in.
			res.json({
				results: unsavedBars
			});
		}
	})
	.catch(function(error) {
		console.log(error);
	});
	
	function checkForOldOrNewSearch(location, unsavedBars, userId) {
		// find user's previous searches.
		Search.find({user_id: userId}, function(error, searches) {
			// if user has no saved searches
			if (searches.length == 0) {
				console.log("no searches were found; user's first search");
				// because no searches, save this search to DB under this
				// user's ID. 
				savedBars = addNewSearch(location, unsavedBars, userId);
				// this saved bar array then passed back to frontend
				// for search results view
				res.status(200).json({
					results: savedBars
				});
			}
			else {
				// user has some saved searches
				for (var i = 0; i < searches.length; i++) {
					// if current search matches any previous one,
					// simply return the previous search's bar data to 
					// frontend.
					if (searches[i].term === location) {
						console.log('a search for term ' +  location + ' already exists!');
						
						res.json({
							results: searches[i].bars
						});
						
					  break;
					}
					else {
						// got to end of the array and found no match. 
						if (i === searches.length - 1) {
							console.log('no matches - going to add new search');
							// add new search to DB
							savedBars = addNewSearch(location, unsavedBars, userId);
							// send bar data from this new search back.
							res.status(200).json({
								results: savedBars
							});
						}
					}
				}
			}
		});  
	}
	
	function addNewSearch(location, data, userId) {
		var bars = [];
		var categories = [];
		var newSearch = new Search();
		
		// create bars array
		_.each(data, function(bar) {
			_.each(bar.categories, function(category) {
				categories.push(category[0]);
			});
			
	    
			
			bars.push({
				_id: bar.id,
				name: bar.name,
				location: {
					address: bar.location.address,
					city: bar.location.city,
					state_code: bar.location.state_code,
					postal_code: bar.location.postal_code
				},
				phone: bar.hasOwnProperty('phone') ? bar.phone : '',
				image_url: bar.image_url,
				snippet_text: bar.snippet_text,
				categories: categories,
				url: bar.url,
				rating: bar.rating,
				guests: 0
			});
			
			categories = [];
		});
		
		newSearch.term = location;
		newSearch.user_id = userId;
		newSearch.bars = bars;
		
		newSearch.save(function(error) {
			if (error) console.log(error);
		});
		
		return bars;
	}
}); // router.post

module.exports = router;