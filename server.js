var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('./server/models/user');

mongoose.connect('mongodb://cranewing-raise-the-bar-ang-3349883:27017:raisethebar');

var bars = require('./server/routes/bars');
var users = require('./server/routes/users');

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/client'));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'double secret',
  resave: false,
  saveUninitialized: false
}));

app.use('/api/bars', bars);
app.use('/api/users', users);


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + 'client/index.html'));
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({
      message: err.message,
      error: err
     });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send({
    message: err.message,
    error: err
  });
});

app.listen(app.get('port'), function() {
  console.log('Wingardium leviosa! Magic at port ' + app.get('port'));
});