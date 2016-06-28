var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = new Schema({
	user_id: String,
	bar_id: String,
	guests: Number
});

module.exports = mongoose.model('Reservation', reservationSchema);