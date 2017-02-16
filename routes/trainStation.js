var express = require('express');
var router = express.Router();
var trainStation = require('../models/trainStation.js');
var q = require('q');
require('mongoose-query-paginate');



var trainstation = {
  getTrainStation: function (req, res) {

    var trainNo = parseInt(req.query.trainNo);
    var startDay = req.query.startDay;
    var options = {
      perPage: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
      sortBy: req.query.sortBy || 'trainNo'
    };

    var query = trainStation.find({ 'trainNo': trainNo }).sort(options.sortBy);
    query.paginate(options, function (err, result) {
      res.json(result);
    });
  },

  createTrainStation: function (req, res) {
    var deferred = q.defer();
    trainStation.insertMany(data, function (err, post) {
      if (err) return err;
      deferred.resolve(post);

    });
    return deferred.promise;
  },

  get_by_trainNo_and_startDay: function (req, res) {
    var deferred = q.defer();
    if (req.query.trainNo !== null && req.query.startDay !== null) {
      var options = {
        perPage: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
        sortBy: req.query.sortBy || 'stopNumber',
        trainNo: req.query.trainNo,
        startDay: req.query.startDay,

      }

      var query = trainStation.find({ 'trainNo': options.trainNo }).sort(options.sortBy);
      query.paginate(options, function (error, result) {
        if (error) {
          deferred.reject(error);
          throw error;
        } else {
          deferred.resolve(res.json(result));
        }

      });

    }
    return deferred.promise;

  },

  listWithDrivingSections: function (req, res) {
    var deferred = q.defer();
    var options = {
      perPage: parseInt(req.params.limit) || 10,
      page: parseInt(req.params.size) || 1,
      sortBy: req.params.sort || 'stopNumber',
      trainNo: parseInt(req.params.trainNo),
      startDay: req.params.startDay,
      userPlan: req.params.userPlan
    }

    var query = trainStation.find({'trainNo':options.trainNo}).sort(options.sort);
    query.paginate(options, function (error, result) {
      if (error) {
        deferred.reject(error);
        throw error
      } else {
        deferred.resolve(res.json(result));
      }

    });


  },


}


module.exports = trainstation;
