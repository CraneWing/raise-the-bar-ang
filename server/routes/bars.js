var express = require('express');
var router = express.Router();
var Yelp = require('yelp');

var User = require('../models/user');
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
	var location = req.query.location.toLowerCase();
	var userId = req.query.userId;
	var signedIn = req.query.signedIn;
	console.log('user id is ' + userId + ' and location is ' + location + ' signed in is ' + signedIn);
	// variable for array of bars added to search
	// to which user has added themselves as guest
	var extraSearchData;
	//console.log(location, userId, signedIn);
	
	// check if user who made search logged in
	if (signedIn && userId !== 'none') {
		console.log('authenticated user exists!');
	
		Search.find({user_id: userId}, function(error, searches) {
			// if user has no saved searches, add search to DB
			if (searches.length == 0) {
				console.log('no searches were found');
				extraSearchData = {
					term: location,
					reservations: []
				};
				console.log('no searches - going to add new search');
				addNewSearch(location, userId);
				console.log('no searches - back from new search');
				doYelpSearch(location, extraSearchData);
			}
			else {
				for (var i = 0; i < searches.length; i++) {
					// if current location term matches a saved
					// search, pass information to the Yelp search.
					// the bars with saved guests will have this 
					// extra info added to search results.
					if (searches[i].term === location) {
						console.log('a search for term ' +  location + ' already exists!');
						extraSearchData = {
							term: searches[i].term,
							reservations: searches[i].going
						};
						console.log('exiting search - going to yelp search');
						doYelpSearch(location, extraSearchData);
						break;
					}
					else {
						// if got to end of the array and found no
						// match
						if (i === searches.length - 1) {
							console.log('no matches - going to add new search');
							addNewSearch(location, userId);
							
							extraSearchData = {
								term: location,
								reservations: []
							};
							console.log('no matches - back from add search');
							doYelpSearch(location, extraSearchData);
						}
					}
				}
			}
		});
	}
	else { // search by unautenticated user
		console.log('search by unauthenticated user');
		extraSearchData = null;
		console.log('doing yelp seach unauth user')
		doYelpSearch(location);
	}
	
	function doYelpSearch(location, extraSearchData) {
		console.log('yelp search called');
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
			//console.log(results);
			res.json({
				results: results,
				extraSearchData: extraSearchData
			});
		})
		.catch(function(error) {
			console.log(error);
		});
	}
	
	function addNewSearch(location, userId) {
		console.log('add new search called');
		var newSearch = new Search();
		newSearch.term = location;
		newSearch.user_id = userId;
					
		newSearch.save(function(error) {
			if (error) console.log(error);
			console.log('search for ' + location + ' was saved!');
		});
	}
});

module.exports = router;