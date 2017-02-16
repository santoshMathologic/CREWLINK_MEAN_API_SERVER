/**
 * 
 *  Custom Query Resolver written By santosh sahu
 *  Date :  30 Auguest 2016
 */
var query;
var q = require('q');
var objectArray = [];
var nonDBFieldsArray = ['limit', 'page', 'order'];
var numberFilterArray = ['stopNo', 'dayOfJourney', 'distance', 'startDay'];

var booleanFields = ['markDelete'];

require('mongoose-query-paginate');
var queryResolver = {
    resolveQuery: function (queryObject, Model, options) {
        try {
            var deferred = q.defer();
               objectArray = [];
                query = processFields(queryObject, Model, options);
                query.deepPopulate('from_station,to_station,train_type');
                query.paginate(options, function (err, response) {
                    if (err) throw new Error("Error in Query Pagination"+err);
                    deferred.resolve(response);
                });
            
            return deferred.promise;
        }
        catch (Error) {
            throw new Error("Error in Query Resolver"+Error);
            
        }

    }
};



function processFields(queryObject, Model, options) {
    try {
        for (var query in queryObject) {
            console.log(query);
            if (queryObject[query] != '' && nonDBFieldsArray.indexOf(query) === -1) {
                if (query === 'train_No') {
                    var q = {};
                    var trainNumber = queryObject[query];
                    q[query] = getTrainNumberQuery(trainNumber);
                    objectArray.push(q);
                } else if (numberFilterArray.indexOf(query) != -1) {
                    var q = {};
                    q[query] = { $gte: parseInt(queryObject[query]) };
                    objectArray.push(q);
                } else if (booleanFields.indexOf(query) != -1) {
                    var q = {};
                    q[query] = (queryObject[query] === 'true');
                    objectArray.push(q);
                }
                else if (query == '_id' || query == 'planId') {
                    var q = {};
                    q[query] = queryObject[query];
                    objectArray.push(q);
                }
               else {
                        var q = {};
                        q[query] = { $regex: queryObject[query], $options: 'i' };
                        objectArray.push(q);
                    }
                

            }
        }
        
        if (objectArray.length == 0) {
            query = Model.find({}).sort(options.order);
        }
        else if (objectArray.length > 0) {
            query = Model.find({}).and([objectArray[0]]).sort(options.order);
            for (var i = 1; i < objectArray.length; i++) {
                query._conditions.$and.push(objectArray[i]);
            }
        }
       
    }

    catch (Error) {
        console.log(Error);
    }
    return query;
}


/**
 * Function that will return either a query or condition
 *  object depending upon the 
 * number of search criterias selected
 */
function getTrainNumberQuery(trainNumber) {
    trainNumber = trainNumber.toString();
    console.log(trainNumber.length);
    var toTrainNumber = trainNumber;
    var fromTrainNumber = trainNumber;
    var i = 5 - trainNumber.length;
    for (var j = 0; j < i; j++) {
        fromTrainNumber += '0';
        toTrainNumber += '9';
    }
    console.log(parseInt(fromTrainNumber));
    console.log(parseInt(toTrainNumber));

    var obj = { $gte: fromTrainNumber, $lte: toTrainNumber };
    return obj;

}

module.exports = queryResolver;