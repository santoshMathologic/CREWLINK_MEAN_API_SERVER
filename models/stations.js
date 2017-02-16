var mongoose = require('mongoose');
var stationSchema = new mongoose.Schema({
    code: { type: String, index: true },
    name: { type: String, index: true },
    head_station_sign_off_duration: { type: Number },
    head_station_sign_on_duration: { type: Number },
    out_station_sign_on_duration: { type: Number },
    out_station_sign_off_duration: { type: Number },
    number_of_beds: { type: Number },

});
module.exports = mongoose.model('station', stationSchema);