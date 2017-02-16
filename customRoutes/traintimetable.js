
var mongoose = require('mongoose');
var trainStationModel = require('../models/trainStation.js');
var q = require('q');
require('mongoose-query-paginate');
var queryResolver  = require("../library/queryResolver.js");


var trainTimeTable = {

    getTrainTimeTable: function (req, res) {

        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            order: req.query.order || 'stopNo',
          
            
        };

         var query;
        queryResolver.resolver(req.query,trainStationModel, options).then(function(response) {
            res.json(response);
        });
    }

}

module.exports = trainTimeTable;