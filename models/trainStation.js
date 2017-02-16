var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var trainStationSchema = new mongoose.Schema({
    trainNo: {type:Number,index: true},
    stopNo: Number,
    stationCode: {type:String,index: true},
    arrivalTime: String,
    departureTime: String,
    arrivalMinutes: Number,
    departureMinutes: Number,
    arrivalDateTime: { type: Date ,default: Date.now },
    departureDateTime: { type: Date,default: Date.now },
    arrivalDay: { type: Number },
    departureDay: { type: Number },
    dayOfJourney: { type: Number },
    distance: { type: Number,index:true},
    station: { type: Schema.Types.ObjectId, ref: 'station', index: true },
    train: { type: Schema.Types.ObjectId, ref: 'train', index: true },
    markDelete: { type: Boolean, default: false },
    createdTime: { type: Date, default: Date.now }
})
trainStationSchema.plugin(deepPopulate);
module.exports = mongoose.model('trainStation', trainStationSchema);