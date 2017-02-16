var express = require('express');
var router = express.Router();
var trainModel = require('../models/train_details.js');
require('mongoose-query-paginate');
var q = require('q');
var trainObject = module.exports = {};
var customQueryResolver = require("../library/curtomQueryResolver");


trainObject.getTrains = function (req, res) {
    var options = {
        perPage: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
        sortBy: req.query.sortBy || 'train_No',
        trainName: req.query.trainName
    };

    var query = trainModel.find({
        $or: [{
            "train_name": { '$regex': options.trainName, $options: 'i' },
        }]
    }).sort(options.sortBy).deepPopulate('from_station,to_station,train_type');
    query.paginate(options, function (err, result) {
        if (err) throw new Error("Error in Accessing TrainDetails" + err);
        res.json(result);
    });

}

trainObject.createBulkUpload = function (data) {
    var deferred = q.defer();
    trainModel.insertMany(data, function (err, post) {
        if (err) return err;
        deferred.resolve(post);

    });
    return deferred.promise;
}

trainObject.getTraindetails = function (req, res) {

    var options = {
        perPage: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
        order: req.query.order || 'train_No',

    };
    var query;
    customQueryResolver.resolveQuery(req.query, trainModel, options).then(function (response) {
        res.json(response);
    });

}

trainObject.searchTrainNumber = function (req, res) {

   // var deferred = q.defer();
    var options = {
        perPage: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
    };
    var trainNo = req.params.trainNo || "";
    var query = trainModel.find({ "train_No": trainNo});
    query.paginate(options, function (err, result) {
        if (err) throw new Error("Error in Accessing Train No" + err);
       return res.json(result);
    });
    //return deferred.promise;


}






