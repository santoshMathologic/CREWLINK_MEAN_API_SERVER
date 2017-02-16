var express = require('express');
var router = express.Router();
var moment = require('moment');
var jwt = require('jsonwebtoken');
var user = require('../models/user.js');
require('mongoose-query-paginate');
var q = require('q');


var auth = {
    login: function (req, res) {


        var dbUserObj = {};
        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        } else {
            auth.validate(username, password).then(function (response) {
                if (response[0]._doc.roleCode === undefined) { // If authentication fails, we send a 401 back
                    res.status(403);
                    res.json({
                        "result": false,
                        "status": "LOGINFAIL",
                        "message": "Invalid username or password"
                    });
                    return;
                } else {

                    getToken(response).then(function (tokenRes) {
                        res.cookie('x-access-token', tokenRes.token);
                        res.cookie('x-key', tokenRes.userName);
                        res.json(tokenRes);

                    });
                }
            }, function (responseError) {
                res.json({
                   "message":responseError
            });
            });
        }
    },
    validate: function (username, pass) {

        var deferred = q.defer();
        user.find({ "userName": username, "password": pass }, function (error, result) {
            if (error) {
                throw new error;
            } else {
                if (result.length == 0) {
                    deferred.reject("UserName and Password Not Match");
                } else {
                    deferred.resolve(result);
                }

            }


        });
        return deferred.promise;
    }

}

function getToken(UserResponse) {
    var deferred = q.defer();
    var token = jwt.sign({ user: UserResponse[0]._doc.userName, iat: Math.floor(Date.now() / 1000) - 30 }, "super.super.secret.shhh");
    deferred.resolve({
        "token": token,
        "userObject": UserResponse
    });
    return deferred.promise;
}


module.exports = auth;
