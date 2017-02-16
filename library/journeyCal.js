var convertTimetoNumber = function (arrivalTime, departureTime) {

    var departure;
    var arrival;
    var diffDayValue;
    var dayJourney = 1;
    if (arrivalTime === null || departureTime === null) {
        throw new Error("Not valid arrivalTime and departureTime passed to convertTimetoNumber()");
    }

    arrival = arrivalTime.split(":");
    var arrivalHour = parseInt(arrival[0].trim());
    var arrivalMin = parseInt(arrival[1].trim());
    arrival = hrsToMinutes(arrivalHour, arrivalMin);

    departure = departureTime.split(":");
    var departureHour = parseInt(departure[0].trim());
    var departureMin = parseInt(departure[1].trim());
    departure = hrsToMinutes(departureHour, departureMin);

    var h = minutesToHours(departure);
    

    if (departure > arrival) {
        dayJourney = dayJourney + 1
    } else {
        dayJourney = dayJourney;

    }
    return dayJourney;

}

function hrsToMinutes(hr, min) {
    return parseInt(hr * 60 + min);
}

function minutesToHours(minutes) {
    var mins = Math.round(parseInt((((minutes / 60) % 1).toFixed(2).substring(2))) * 0.6);
    mins = (mins < 10) ? "0" + mins : mins;
    var hrs = Math.floor(minutes / 60);
    hrs = (hrs < 10) ? "0" + hrs : hrs;
    return hrs + "h " + mins + "m";
}

function minutesToTimeFormat(minutes) {
    var mins = Math.round(parseInt((((minutes / 60) % 1).toFixed(2).substring(2))) * 0.6);
    mins = (mins < 10) ? "0" + mins : mins;
    var hrs = Math.floor(minutes / 60);
    hrs = (hrs < 10) ? "0" + hrs : hrs;
    return hrs + ":" + mins;
}



function diffTwoTimesWithoutDay(t0, t1) {
    var r = 0;
    if(t0===null || t1===null){
        throw new Error("Not valid t0 & t1 passed to diffTwoTimesWithoutDay()"); 
    }
    t0 = timeToMinuts(t0);
    t1 = timeToMinuts(t1);
    if (t0 <= t1) {
        r = t1 - t0;
    } else {
        r = t1 + 1440 - t0;
    }
    return r;
}

function timeToMinuts(time) {
    time = time.split(":");
    return parseInt(time[0]) * 60 + parseInt(time[1]);
}

var journeyCalculation = {
    convertTimetoNumber: convertTimetoNumber,
    diffTwoTimesWithoutDay: diffTwoTimesWithoutDay,
}




module.exports = journeyCalculation;