var mongoose = require('mongoose');
var pilotSchema = new mongoose.Schema({
    name: String,
});
module.exports = mongoose.model('pilotType',pilotSchema);