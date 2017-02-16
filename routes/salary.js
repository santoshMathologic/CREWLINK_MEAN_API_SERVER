var mongoose = require('mongoose');
//var salaryModel = require('../models/salary.js').collection.initializeOrderedBulkOp();
var salaryModel = require('../models/salary.js');
var userModel = require('../models/user.js');
var q = require('q');
require('mongoose-query-paginate');

var salary = {
    createSalary: function (req, res) {
        var salaryObj = new salaryModel({
            employeeId: req.body.employeeId,
            employeeName: req.body.employeeName,
            salary: req.body.salary,
            designation: req.body.designation,
            remarks: req.body.remarks,
            depositedOn: '2014-12-04T08:00:00.000Z',
            userId: req.body.userId || "571dbbf1d4367766261acf40",
            planId: req.body.planId || "57c13d47d0dc853c281cbb0e"
        })

        salaryObj.save(function (err) {
            if (err) return err;
            res.status(201);
            return res.json({
                "status": "200",
                "success": true,
                "message": "Expenses saved Successfully",
            })
        })
    },

    deleteSalary: function (req, res) {
        var id = req.params.id;
        salaryModel.findByIdAndUpdate(id, { 'markDelete': true }, function (result) {
            res.status(201);
            res.json({
                "status": 200,
                "message": "delete Successfully"
            })
        }, function (error) {
            console.log("error" + error);
        })
    },



    updateSalary: function (req, res) {
        var id = req.params.id;
        salaryModel.findByIdAndUpdate(id, req.body, function (result) {
            res.status(201);
            res.json({
                "status": 200,
                "message": "Update Successfully"
            })
        }, function (error) {
            console.log("error" + error);
        })
    },

    bulkUpdate: function (req, res) {


        var bulk = salaryModel.collection.initializeOrderedBulkOp();
        for (var nCount = 0; nCount < req.body.length; nCount++) {
            var id = req.body[nCount]._id;
            var markDelete = req.body[nCount].markDelete;
            // salaryModel.find({ '_id': id }).update({ $set: { markDelete: markdel } });
            bulk.find({
                "_id": mongoose.Schema.Types.ObjectId(id),

            }).upsert().update({
                "$set": { "markDelete": true },
                "$multi": true,
                //"$push": { "markDelete": true }
            });

            //  bulk.find({ '_id' : id}).update({ $set: { 'markDelete' : markDelete } });
            bulk.execute(function (error, response) {
                console.log("" + response)
            });

        }
        res.json({
            "status": 200,
            "message": "Update Successfully"
        })
    },


    getSalary: function (req, res) {
     var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy || 'name'
        };
      var query = salaryModel.find().sort(options.sortBy).deepPopulate('userId');
        query.paginate(options, function (err, result) {
            res.json(result);
        });

    }
}

module.exports = salary;