var assert = require('assert');
var express = require('express');
var router = express.Router();
var planModel = require('../models/userPlan.js');
require('mongoose-query-paginate');
var q = require('q');
var planObject = module.exports = {};


planObject.getPlan = function (req, res) {
    var options = {
        perPage: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
        sortBy: req.query.sortBy || 'planName',
        planName: req.query.planName,
        owner: req.query.owner,
        reviewer: req.query.reviewer,
        coplanner: req.query.coplanner

    };

    var query = planModel.find({
        $or: [{
            "planName": { '$regex': options.planName, $options: 'i' },
            "owner": { '$regex': options.owner, $options: 'i' },
            "reviewer": { '$regex': options.reviewer, $options: 'i' },
            "coPlanners": {"$in" : ["c1"]} 
             
             //"coPlanners":{"cname":'$elemMatch' : options.coplanner}
        }]
    }).sort(options.sortBy);
    query.paginate(options, function (err, result) {
        if (err) throw new Error("Error in Accessing userPlan" + err);
        res.json(result);
    });

}

planObject.createUserPlan = function (req, res) {

    var userPlana = new planModel({
        planName: req.body.planName,
        owner: "santosh",
        coPlanners: [ "c1",
         "c2",
         "c3",
         "c4",
         "c5",   
        ],
        reviewer: "Sanjay",
    });

    userPlana.save(function (error) {
        if (error) return error;
        res.status(201);
        return res.json({
            "status": 200,
            "success": true,
            "message": "User saved Successfully",
        });

    });

}