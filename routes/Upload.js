var express = require('express');
var router = express.Router();
var fs = require('fs');
var q = require('q');
var multer = require('multer')
var Promise = require("bluebird");
var upload = multer({ dest: 'uploads/' })
var trainModel = require('../models/train_details.js');
var traindetail = require('./Train_details.js');
var stationModel = require('../models/stations.js');

var trainRoute = require('./Train_details.js');
var uploadModel = require("../models/upload.js");

var trainTimeTableRoutes = require("./Train_TimeTable.js");

var UploadObject = module.exports = {};
var each = require('foreach');
var trainDetailsArray = [];
var trainStationDetailsArray = [];
var _ = require('lodash');

//var uploadPro = require('../ModelPrototype/UploadPrototype.js');



var isDebug = false;
var DEBUG = function (val) {
    if (isDebug) {
        console.log("SpringDataRestApi : LOG : ");
        console.log(val);
    }
};
var ERROR = function (val) {
    console.log("SpringDataRestApi : ERROR : ");
    console.log(val);
};

var LOG = function (val) {
    console.log("SpringDataRestApi : LOG : ");
    console.log(val);
};


UploadObject.isProcessed_and_status = function (req, res) {

    var markDelete = req.query.markDelete;
    var id = req.query.id;
    var deferredUpdate = q.defer();
    uploadModel.findByIdAndUpdate(id, { 'isProcessed': true, 'status': "processed" }, function (error, result) {
        if (error) return error;
        else {
            deferredUpdate.resolve(result);
        }

    })
    return deferredUpdate.promise;


},

    UploadObject.removeUpload = function (req, res) {
        var markDelete = req.body.params.markDelete;
        var id = req.body.params.id;
        uploadModel.findByIdAndUpdate(id, { 'markDelete': markDelete }, function (error, result) {
            if (error) return error;
            else {
                res.status(201);
                return res.json({
                    "status": "200",
                    "success": true,
                    "message": "Uploaded  Removed Successfully",
                });
            }

        });
    },


    UploadObject.getUpload = function (req, res) {
        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy || 'originalFileName'
        };

        var query = uploadModel.find({}).sort(options.sortBy);
        query.paginate(options, function (err, result) {
            res.json(result);
        });
    }

UploadObject.createUpload = function (req, res) {
    var path = req.file.path;
    var name = req.file.filename;

    var originalFileName = req.file.originalname;
    var file = __dirname + "/" + req.file.filename;
    var dataType = req.body.dataType;
    var fileType = req.body.fileType;
    var description = req.body.description;
    var status = req.body.status;
    var dir = 'uploadedCSV';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    try {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                throw new Error("Error Reading in File : " + err)
            } else {

                buffer = new Buffer(data);
                var uploadObject = new uploadModel({
                    data: buffer,
                    dataType: dataType,
                    fileType: fileType,
                    originalFileName: originalFileName,
                    uploadedBy: "santosh",
                    isProcessed: false,
                    status: description,
                    description: description,

                })

                //  uploadPro = new UploadStuff(data,dataType);

                uploadModel.create(uploadObject, function (err) {
                    if (err) return err;
                    res.status(201);
                    return res.json({
                        "status": 200,
                        "success": true,
                        "message": "Upload saved Successfully",
                    });
                });

                fs.open(path, 'w', function (err, fd) {
                    if (err) {
                        throw 'error opening file: ' + err;
                    }

                    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                        if (err) throw "error in writing file: " + err;
                        else {

                            fs.unlink("./uploads/" + name, function (err) {
                                if (err) throw new Error("Unable to Removed File : " + err)
                                else {
                                    console.log("Junk file deleted SuccessFully " + "./uploads/" + name);
                                    //  chooseProcessing(originalFileName, data);

                                }
                            });

                        }

                    });
                });



            }



        });


    } catch (exception) {
        console.log("Exception :" + exception);
    }


}

UploadObject.ProcessUpload = function (req, res) {

    var originalFileName = req.body.params.processData.originalFileName;
    var data = req.body.params.processData.data;
    var dataType = req.body.params.processData.dataType;

    if (dataType !== null && data != null) {
        switch (dataType) {
            case "TrainDetails":
            case "traindetails":
                chooseProcessing(originalFileName, data);
                break;

            case "TrainStation":
            case "trainstation":
                chooseProcessing(originalFileName, data);
                break;

        }
    }
}





function chooseProcessing(fileType, data) {

    if (fileType != null && fileType != undefined && fileType != "") {
        switch (fileType) {

            case "combine_train_details - extraSmall.csv":
            case 'COMBINE_TRAIN_DETAILS - EXTRASMALL.csv':
            case 'combine_train_details.csv':
            case 'COMBINE_TRAIN_DETAILS.csv':
            case 'trainDetails':
                processTrainDetails(data).then(function (successResponse) {
                    if (typeof successResponse != undefined) {
                        successResponse.forEach(function (response) {
                            q.all([
                                find_station(response.sourceStationCode),
                                find_station(response.destinationStationCode),
                                find_trainType(response.trainType)
                            ]).spread(function (sourceStationResponse, destinationStationResponse, trainTypeResponse) {

                                var trainNo = response.trainNo;
                                var trainName = response.trainName;
                                var fromStation = response.sourceStationCode;
                                var toStation = response.destinationStationCode;
                                var fromReference = sourceStationResponse[0]._id;;
                                var toReference = destinationStationResponse[0]._id;
                                var trainTypeReference = trainTypeResponse[0]._id;
                                push_TrainDetails_To_Array(trainNo, trainName, 1, fromReference, toReference, trainTypeReference, fromStation, toStation);
                                trainRoute.createBulkUpload(trainDetailsArray).then(function (res) {

                                    console.log(res);

                                });
                                trainDetailsArray = [];
                            });


                        });
                    }
                });
                break;

            case "combine_train_stations - extraSmall.csv":
            case 'COMBINE_TRAIN_STATIONS - EXTRASMALL.csv':
            case 'combine_train_stations.csv':
            case 'COMBINE_TRAIN_STATIONS.csv':
            case 'trainStations':
            case 'combine_train_stations -64964.csv':

            try{
                processTrainStations(data).then(function (trainresponse) {

                  for(var nCount = 0;nCount<trainresponse.length;nCount++){

                         q.all([
                                find_trainReference(parseInt(trainresponse[nCount].trainNo)),
                                find_stationReference(trainresponse[nCount].stationCode),
                            ]).spread(function (trainRes, stationRes) {
                                console.log(trainRes);
                                console.log(stationRes);
                                // push_TrainStationDetails_To_Array(trainNo, stopNumber, stationCode, dayOfJourney, 0, 0, 0, 1, arrivalTime, departureTime, distance)
                            });

                      ///console.log(""+trainresponse[nCount].trainNo);
                      //console.log(""+trainresponse[nCount].stationCode);
                      
                  }

                 
                });
            }catch(e){
                console.log("Error in Train Processing :"+e);
            }
                break;


            default:
                alert("File has not been uploaded ");

        }
    }



}

function processTrainStations(data) {

    var deferred = q.defer();
    var regExpression = /(\r\n|\n|\r)/gm;
    var rows = data.replace(regExpression, "\n").split("\n");
    var header = rows[0].split(",");
    var trainNo = 0;
    var stopNumber;
    var stationCode;
    var arrivalTime;
    var departureTime;
    var dayOfJourney;
    var distance;
    var trainstationDetailsArray = [];

    //console.log(rows);
    for (var nCount = 1; nCount < rows.length; nCount++) {
        var rowtrainStationDetail = rows[nCount].split(",");
       
        trainNo             = rowtrainStationDetail[0];
        stopNumber          = rowtrainStationDetail[1];
        stationCode         = rowtrainStationDetail[2];
        dayOfJourney        = rowtrainStationDetail[3];
        arrivalTime         = rowtrainStationDetail[4];
        departureTime       = rowtrainStationDetail[5];
        distance            = rowtrainStationDetail[6];


        if (trainNo != "" && stopNumber != "" && stationCode != "" && dayOfJourney != "" && arrivalTime != "" && departureTime != "" &&
            distance != "") {
            trainstationDetailsArray.push({
                trainNo: trainNo,
                stopNumber: stopNumber,
                stationCode: stationCode,
                dayOfJourney: dayOfJourney,
                arrivalTime: arrivalTime,
                departureTime: departureTime,
                distance: distance,
            });

            deferred.resolve(trainstationDetailsArray);
        }
    }


    return deferred.promise;
}
function processTrainDetails(data) {

    var deferred = q.defer();
    var regExpression = /(\r\n|\n|\r)/gm;
    var rows = data.replace(regExpression, "\n").split("\n");
    var header = rows[0].split(",");
    var trainNo = 0;
    var trainName;
    var sourceStationCode;
    var sestinationStationCode;
    var trainType;

    var promises = [];
    var trainDetails = [];
    for (var nCount = 1; nCount < rows.length; nCount++) {
        var rowstrainDetail = rows[nCount].split(",");
        trainNo = rowstrainDetail[0];
        trainName = rowstrainDetail[1];
        sourceStationCode = rowstrainDetail[2];
        destinationStationCode = rowstrainDetail[3];
        trainType = rowstrainDetail[11];
        trainDetails.push({ "trainNo": trainNo, "trainName": trainName, "sourceStationCode": sourceStationCode, "destinationStationCode": destinationStationCode, "trainType": trainType });
        deferred.resolve(trainDetails);

    }

    return deferred.promise;
}

function push_TrainDetails_To_Array(trainNo, trainName, startDay, fromStation, toStation, trainType, fStation, tStation) {
    trainDetailsArray.push({
        train_No: trainNo,
        train_name: trainName,
        start_day: startDay,
        from_station: fromStation,
        to_station: toStation,
        train_type: trainType,
        fStation: fStation,
        tStation: tStation
    });

}


function push_TrainStationDetails_To_Array(trainNo, stopNumber, stationCode, dayOfJourney, arrivalMinutes, departureMinutes, arrivalDay, departureDay, arrivalTime, departureTime, distance, trainRef, stationRef) {
    trainStationDetailsArray.push({
        trainNo: parseInt(trainNo),
        stopNo: parseInt(stopNumber),
        stationCode: stationCode,
        dayOfJourney: parseInt(dayOfJourney),
        arrivalMinutes: arrivalMinutes,
        departureMinutes: departureMinutes,
        arrivalDay: arrivalDay,
        departureDay: departureDay,
        arrivalTime: arrivalTime,
        departureTime: departureTime,
        distance: parseInt(distance),
        train: trainRef,
        station: stationRef,
    });

}

function find_trainReference(trainNumber) {
    var deferred = q.defer();
    trainModel.find({
        train_No: trainNumber
    }, function (err, result) {
        if (err) {
            deferred.reject(err)
            console.log(err);
        }
        else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}

function find_stationReference(stationCode) {
    var deferred = q.defer();
    stationModel.find({
        code: stationCode
    }, function (err, result) {
        if (err) {
            deferred.reject(err)
            console.log(err);
        }
        else {
            console.log(result);
            deferred.resolve(result);

        }
    });
    return deferred.promise;
}

function find_station(stationCode) {
    var deferred = q.defer();
    stationModel.find({
        code: stationCode
        // $and: [
        //   { code: stationCode },
        // { name: stationName }
        // ]
    }, function (err, result) {
        if (err) {
            deferred.reject(err)
            console.log(err);
        }
        else {
            deferred.resolve(result);

        }
    });
    return deferred.promise;
}
