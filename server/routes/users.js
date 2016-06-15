var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.post('/signup', function(req, res) {

  User.register(new User({
    username: req.body.username,
    display_name: req.body.name}),
     req.body.password, function(error, account) {
      if (error) {
        res.json({
          error: 'signup_error'
        });
      }

      passport.authenticate('local')(req, res, function() {
        res.json({
          type: 'signup_success'
        });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(error, user, info) {
    if (error) return next(error);

    if (!user) {
      res.json({
        flash: {
          type: 'user_note_found',
          user: req.body.username
        }
      });
    }

    req.login(user, function(error) {
      if (error) {
        res.json({
          type: 'login_error',
          error: error
        });
      }

      res.json({
        type: 'login_success',
        currentUser: {
          username: user.username,
          display_name: user.display_name
        }
      });
    });
  })(req, res, next);
});

// log user out
router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    type: 'user_logout'
  });
});

// check if user is logged in or ut
router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false,
      type: 'error',
      message: 'User is not logged in'
    });
  }

  res.status(200).json({
      status: true,
      type: 'success',
      message: 'User logged in and authenticated'
    });
});

module.exports = router;