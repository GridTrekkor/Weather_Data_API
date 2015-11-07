var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WeatherSchema = new Schema({
    ID : Number,
    Year : Number,
    Month : Number,
    Day : Number,
    Hi : Number,
    Lo : Number
});



var WeatherModel = mongoose.model('WeatherModel', WeatherSchema);

module.exports = WeatherModel;