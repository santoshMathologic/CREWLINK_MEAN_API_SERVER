var express = require('express');
var router = express.Router();


var trainTimeTable = require('./traintimetable.js');





router.get('/api/v1/trainstation', trainTimeTable.getTrainTimeTable);



module.exports = router;