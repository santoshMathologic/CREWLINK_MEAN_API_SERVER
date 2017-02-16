var express = require('express');
var router = express.Router();
var stations = require('../models/stations.js');
require('mongoose-query-paginate');
var customQueryResolver = require("../library/curtomQueryResolver");


var station = {

  getStations: function (req, res) {
    var options = {
      perPage: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
      sortBy: req.query.sortBy || 'code',
      code : req.query.code,
      name:req.query.name
    };
    
    var sorting = (req.query.sortBy) ? req.query.sortBy : 'code';  
    var reverseOrder = (parseInt(req.query.reverseOrder))?parseInt(req.query.reverseOrder) : 1
    var query = stations.find({
      "$query": {
        "code": { '$regex': options.code, $options: 'i' },
        "name": { '$regex': options.name, $options: 'i' }
      }, $orderby: {"name" : -1 },
      $explain: true
    }).sort({"code" : reverseOrder}) 
    query.paginate(options, function (error, cursor) {
      if(error)throw new Error("Error in Fetching List of Stations "+error);
         res.json(cursor);
    });
    


  },

  getStationsByQuery: function (req, res) {
    if (req.params.searchQuery) {
      stations.find({ "code": { '$regex': req.params.searchQuery, $options: 'i' } }).then(function (result) {
        res.json(result);
      });
    }
  },


  createStation: function (req, res) {

    var stationObj = new stations({
      code: req.body.code || "",
      name: req.body.name || "",
      head_station_sign_off_duration: req.body.headStationSignOffDuration || 30,
      head_station_sign_on_duration: req.body.headStationSignOnDuration || 30,
      out_station_sign_off_duration: req.body.outStationSignOffDuration || 30,
      out_station_sign_on_duration: req.body.outStationSignOnDuration || 30,
      number_of_beds: 1,
    });

    stations.create(stationObj, function (error, response) {
      if (error) throw new Error('Error in Saveing Station ' + error);
      else {
        res.status(201);
        return res.json({
          "status": "200",
          "success": true,
          "message": "Station saved Successfully",
        })
      }


    });
  },

  getStationsbyQueryResolver: function (req, res) {
    var options = {
      perPage: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
      sortBy: req.query.sortBy || 'code'
    };

    var query;
    customQueryResolver.resolveQuery(req.query, stations, options).then(function (response) {
      res.json(response);
    });


  },

}



module.exports = station;
