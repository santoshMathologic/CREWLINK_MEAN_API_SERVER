var express = require('express');
var router = express.Router();
var trainStationModel = require('../models/trainStation.js');
var q = require('q');
require('mongoose-query-paginate');




var trainstation = module.exports = {};



trainstation.getTrainTimeTable = function (req, res) {
    var options = {
        perPage: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
        sortBy: req.query.sortBy || 'stopNo',
        trainNumber: req.query.trainNo
    };

    var query = trainStationModel.find({ trainNo: options.trainNumber }).sort(options.sortBy);
    query.paginate(options, function (err, result) {
        res.json(result);
    });
},

    trainstation.createBulkUpload = function (data) {
        var deferred = q.defer();
        trainStationModel.insertMany(data, function (err, post) {
            if (err) return err;
            deferred.resolve(post);

        });
        return deferred.promise;
    }




