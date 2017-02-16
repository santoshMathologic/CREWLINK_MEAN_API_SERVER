var express = require('express');
var router = express.Router();
var crewtype = require('../models/crewType.js');
require('mongoose-query-paginate');

var crewType = {
  getCrewType: function (req, res) {
    var options = {
      perPage: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
      sortBy: req.query.sortBy || 'name',
      crewType: req.query.crewType || ''
    };

    var query = crewtype.find({
      $or: [{
        "name": { '$regex': options.crewType, $options: 'i' },
      }]

    }).sort(options.sortBy);
    query.paginate(options, function (err, result) {
      res.json(result);
      console.log(""+result);
    });
  },

  createCrewType: function (req, res) {
    var crewtypeObj = new crewtype({
      name: req.body.name || "",
    });
    crewtype.create(crewtypeObj, function (error, post) {
      if (error) throw new Error('Error in creating CrewType ' + error);
      else {
        res.status(201);
        return res.json({
          "status": "200",
          "success": true,
          "message": "crewType saved Successfully",
        })
      }
    });
  }



}

module.exports = crewType;
