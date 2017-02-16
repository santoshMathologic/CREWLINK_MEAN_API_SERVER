var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
//var mongoosePaginate = require('mongoose-paginate');

var salarySchema = new mongoose.Schema({
    depositedOn: { type: Date, default: Date.now },
    employeeName: { type: String, default: "" },
    employeeId: { type: String, default: "MIT110"  },
    salary: { type: Number, default: 10000 },
    designation: { type: String, default: "Programmer" },
    remarks: { type: String },
    markDelete: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'user',index:true},
    planId:{ type: Schema.Types.ObjectId, ref: 'plan',index:true},
});
//salarySchema.plugin(mongoosePaginate);
salarySchema.plugin(deepPopulate);
module.exports = mongoose.model('salary', salarySchema);
