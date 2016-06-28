var express = require('express');
var app = express();
var logger = require('morgan');

var bodyParser = require('body-parser');
var cors = require('cors');

var mongoose = require('mongoose');
mongoose.connect('mongodb://cranewing-raise-the-bar-ang-3349883:27017/raisethebar');

var bars = require('./server/routes/bars');
var users = require('./server/routes/users');

var port = process.env.PORT || 3000;
app.use(logger('dev'));

app.use(cors({
	credentials: true,
	origin: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/client'));

app.use('/api/bars', bars);
app.use('/api/users', users);

app.get('*', function(req, res) {
	res.redirect('/#' + req.originalUrl);
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

app.listen(port, function() {
  console.log('Wingardium leviosa! Magic at port ' + port);
});