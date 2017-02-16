var mongoose = require('mongoose');
var divisionSchema = new mongoose.Schema({
    name: String,
})
module.exports = mongoose.model('division',divisionSchema);