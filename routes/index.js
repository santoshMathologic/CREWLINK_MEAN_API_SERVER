var express = require('express');
var router = express.Router();
var multer = require('multer');
//var upload = multer({ dest: './uploads' });

var upload = multer({
  dest: './uploads',
 /* limits: {
         fileSize: 5 * 1000000
    }
    */
});



var user = require('./User.js');
var train = require('./Train_details.js');
var station = require('./Station.js');

var userUpload = require('./Upload.js');
var userPlan = require('./userPlan.js');
var role = require('./role.js');

var station = require('./station.js');
var division = require('./division.js');

var crewType = require('./crewType.js');
var salary = require('./salary.js');

var trainTimeTable = require('./Train_Timetable.js');
var trainstation = require('./trainStation');
var auth = require("./auth.js");






// Routes for Authenticaton

router.post('/api/v1/login', auth.login);


// routes for Division
router.get('/api/v1/divisions', division.getDivision);
router.post('/api/v1/divisions', division.createDivision);

//Routes for crewType
router.get('/api/v1/crewTypes', crewType.getCrewType);
router.post('/api/v1/crewTypes', crewType.createCrewType);




// station Routes 
router.get('/api/v1/stations', station.getStations);
router.post('/api/v1/stations', station.createStation);
router.get('/api/v1/stations/stationsByQuery/:searchQuery', station.getStationsByQuery);
router.get('/api/v1/stations/queryResolver', station.getStationsbyQueryResolver);

// Routes for Users
router.get('/api/v1/admin/users', user.getUsers);
router.post('/api/v1/admin/users', user.createUser);
router.get('/api/v1/admin/users/searchUser/:term', user.searchUerbyQuery);
router.get('/api/v1/admin/users/getOne', user.getOne);



// Routes for Train Details
router.get("/api/v1/traindetails", train.getTrains);
router.get("/api/v1/gettraindetails", train.getTraindetails);



// Routes for upload
router.get("/api/v1/upload",userUpload.getUpload);
router.post("/api/v1/upload/createUpload",upload.single('Uploadfile'),userUpload.createUpload);
router.put("/api/v1/upload/removeUpload",userUpload.removeUpload);
router.post("/api/v1/upload/ProcessUpload",userUpload.ProcessUpload);


// Routes for UserPlan 
router.get("/api/v1/userPlans", userPlan.getPlan);
router.post('/api/v1/userPlans/savePlan', userPlan.createUserPlan);




//Routes for role
router.get('/api/v1/roles', role.getRole);
router.post('/api/v1/roles', role.creteRole);

//// temporary routes for salary
// Routes for SALARY

router.post('/api/v1/salary', salary.createSalary);
router.get('/api/v1/salary', salary.getSalary);
router.put('/api/v1/salary/bulkUpdate', salary.bulkUpdate);
router.put('/api/v1/salary/:id', salary.deleteSalary);
router.put('/api/v1/salary/update/:id', salary.updateSalary);


router.get('/api/v1/timetables', trainTimeTable.getTrainTimeTable);

//Routes for trainstation
router.get('/api/v1/trainstations', trainstation.getTrainStation);
router.post('/api/v1/trainstations', trainstation.createTrainStation);
router.get('/api/v1/trainstations/search_trainNo_and_startDay', trainstation.get_by_trainNo_and_startDay);

router.get('/api/v1/trainStations/listWithDrivingSections/:userPlan/:sort/:trainNo/:startDay/:page/:limit',trainstation.listWithDrivingSections);

//Routes for trainstation

router.get('/api/v1/trains/searchTrain/:trainNo', train.searchTrainNumber);


module.exports = router;
