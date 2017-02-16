var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
mongoose.set('debug', false);


var train_detailSchema = new mongoose.Schema({
    train_No: { type: Number, default: 0,index: true},
    train_name: { type: String, default: "" ,index: true},
    start_day: [{type:Number}],
    from_station: { type: Schema.Types.ObjectId, ref: 'station', index: true },
    to_station: { type: Schema.Types.ObjectId, ref: 'station', index: true },
    //train_type: { type: Schema.Types.ObjectId, ref: 'traintype', index: true },
    markDelete: { type: Boolean, default: false },
    createdTime: { type: Date, default: Date.now },
    fStation:{ type: String, default: "" },
    tStation:{ type: String, default: "" },
})
train_detailSchema.plugin(deepPopulate);
module.exports = mongoose.model('train_detail', train_detailSchema);
