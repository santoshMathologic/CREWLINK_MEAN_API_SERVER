var express = require('express');
var router = express.Router();
var div = require('../models/division.js');
require('mongoose-query-paginate');

var division = {

  getDivision: function (req, res) {
    var options = {
      perPage: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
      sortBy: req.query.sortBy || 'name'
    };

    var query = div.find({}).sort(options.sortBy);
    query.paginate(options, function (err, result) {
      res.json(result);
    });
  },

  createDivision: function (req, res) {
    var divisionObj = new div({
      name: req.body.name || "",
    });
    div.create(divisionObj, function (error) {
      if (error) throw new Error('Error in creating division ' + error);
      else {
        res.status(201);
        return res.json({
          "status": "200",
          "success": true,
          "message": "division saved Successfully",
        })
      }
    });
  }





}


module.exports = division;
