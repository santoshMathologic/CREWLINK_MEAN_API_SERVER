
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/crewlink', function(error) {
    if (error) {
        console.log('Error in Connection DataBase', error);
    } else {
        console.log('Connection Successfully !!!!');
    }
});

