


var query;
var q = require('q');
var objectArray = [];
var nonDBFieldsArray = ['limit', 'page', 'order'];
var NumberArray = ['stopNo', 'dayOfJourney', 'distance', 'startDay']
require('mongoose-query-paginate');

var queryResolverObject = {


      resolver: function (queryObject, Model, options) {
            try {
                  var deferred = q.defer();
                  objectArray = [];
                  query = processFields(queryObject, Model, options);
                  query.paginate(options, function (err, response) {
                        if (err) throw new Error("Error in Query Pagination" + err);
                        deferred.resolve(response);
                  });
                  return deferred.promise;
            } catch (err) {
                  throw new Error("Error in Query Pagination" + err);

            }
      }



};

function processFields(queryObject, Model, options) {

      try {
            for (query in queryObject) {

                  console.log("Key : " + query + " Values : " + queryObject[query]);

                  if (queryObject[query] != "" && nonDBFieldsArray.indexOf(query) === -1) {
                        if (query === "trainNo") {
                              var q = {};
                              var trainNumber = queryObject[query];
                              q[query] = getTrainNumberQuery(trainNumber);
                              objectArray.push(q);

                         }else if(NumberArray.indexOf(query)!=-1){
                               var q = {};
                               q[query] = { $gte: parseInt(queryObject[query]) };
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


      } catch (Exception) {
            console.log("Error : " + Exception);
             throw new Error("Error in Query Pagination" + Exception);
      }

      return query;
}

function getTrainNumberQuery(trainNumber) {
      trainNumber = trainNumber.toString();
      console.log(trainNumber.length);
      var tto = trainNumber;
      var tfrom = trainNumber;
      var i = 5 - trainNumber.length;
      for (var j = 0; j < i; j++) {
            tto += '0';
            tfrom += '9';
      }


      var obj = { $gte: tto, $lte: tfrom };
      return obj;
}



module.exports = queryResolverObject;

