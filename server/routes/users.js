var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var qs = require('querystring');
var request = require('request');

var keys = require('../config/keys');
var User = require('../models/user');
var authMiddleware = require('../middleware/auth-middleware');

router.post('/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(error, signupUser) {
    if (signupUser) {
      return res.status(409).send({
        message: {
          email: 'Sorry, that email is already taken'
        }
      });
    }

    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      display_name: req.body.display_name
    });

    newUser.save(function() {
      var token = authMiddleware.createToken(newUser);

      res.send({
        token: token,
        user: newUser
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  User.findOne({ email: req.body.email}, '+password', function(error, user) {
    if (!user) {
      return res.status(401).send({
        message: {
          email: 'Sorry, user not found!'
        }
      });
    }

    bcrypt.compare(req.body.password, user.password, function(error, isMatch) {
      if (!isMatch) {
        return res.status(401).send({
          message: {
            password: 'Incorrect password'
          }
        });
      }

      user = user.toObject();
      
      delete user.password;

      var token = authMiddleware.createToken(user);

      res.send({
        token: token,
        user: user
      });
    });
  });
});

// Twitter based authentication/signup
router.post('/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: keys.twitter.consumerKey,
      consumer_secret: keys.twitter.consumerSecret,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({
      url: requestTokenUrl,
      oauth: requestTokenOauth
    }, function(err, response, body) {
      console.log(body);
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  }
  else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: keys.twitter.consumerKey,
      consumer_secret: keys.twitter.consumerSecret,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({
      url: accessTokenUrl, 
      oauth: accessTokenOauth
    }, function(err, response, accessToken) {
       
      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: keys.twitter.consumerKey,
        consumer_secret: keys.twitter.consumerSecret,
        oauth_token: accessToken.oauth_token
      };

      // Step 4. Retrieve profile information about the current user.
      request.get({
        url: profileUrl + accessToken.screen_name,
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {
        if (req.header('Authorization')) {
         // Step 5a. Link user accounts.
         User.findOne({ twitter_id: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({
                message: 'Error: you already have a Twitter account with us.'
              });
            }

            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, keys.local.tokenSecret);

            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({
                  message: 'User not found'
                });
              }

              user.twitter_id = profile.id;
              user.display_name = user.display_name || profile.name;
              user.profile_img = profile.profile_image_url.replace('_normal', '');
              
              user.save(function(err) {
                res.send({
                  token: authMiddleware.createToken(user),
                  user: user
                });
              });
            });
          });
        }
        else {
          // Step 5b. Create a new user account or return an existing one.
          User.findOne({ twitter_id: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.send({
                token: authMiddleware.createToken(existingUser),
                user: existingUser
              });
            }

            var user = new User();
            user.twitter_id = profile.id;
            user.display_name = profile.name;
            user.profile_img = profile.profile_image_url.replace('_normal', '');
            
            user.save(function() {
              res.send({
                token: authMiddleware.createToken(user),
                user: user
              });
            });
          });
        }
      });
    });
  }
});

module.exports = router;