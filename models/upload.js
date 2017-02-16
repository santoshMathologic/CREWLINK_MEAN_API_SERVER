var mongoose = require('mongoose');
var uploadSchema = new mongoose.Schema({
    data: { type: String, default: null },
    dataType: String,
    fileType: String,
    originalFileName: String,
    uploadedBy: String,
    isProcessed: { type: Boolean, default: false },
    status: { type: String, default: null },
    message: String,
    markDelete: { type: Boolean, default: false },
    uploadedTime: { type: Date, default: Date.now },
    description: { type: String, default: null },
})
module.exports = mongoose.model('upload', uploadSchema);