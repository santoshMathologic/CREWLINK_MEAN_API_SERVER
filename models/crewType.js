var mongoose = require('mongoose');
var crewTypeSchema = new mongoose.Schema({
    name: String,
})
module.exports = mongoose.model('crewType',crewTypeSchema);