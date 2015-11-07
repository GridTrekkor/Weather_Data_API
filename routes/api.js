var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var WeatherModel = require('../models/weatherModel.js');
var Account = require('../models/accountsModel');
var daysInMonth = ['', 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function getData(apiKey, searchString, req, res) {

    // check for valid key before running query
    Account.find({apiKey : apiKey}).find(function (err, apiData) {

        if (err) {
            console.log("API GET", err);
        } else {

            if (apiData.length > 0) {
                //// query database with given search string
                WeatherModel.find(searchString).sort("ID").find(function (err, weatherData) {
                    if (err) {
                        console.log("GET", err);
                    }
                    // send JSON data to client
                    res.json(weatherData);
                });
            } else {
                res.json("ERROR: Invalid API Key");
            }

        }

    });

}

// api GET router /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', function(req, res) {
    res.json({ empty: 'data' });
});

var searchString;

router.get('/:key_param?/years/:year_param?/months/:month_param?/days/:day_param?', function(req, res) {
    searchString = ({ 'Year' : req.params.year_param, 'Month' : req.params.month_param, 'Day' : req.params.day_param });
    getData(req.params.key_param, searchString, req, res);
});

// GET year/month
router.get('/:key_param?/years/:year_param?/months/:month_param?', function(req, res) {
    searchString = ({ 'Year' : req.params.year_param, 'Month' : req.params.month_param });
    getData(req.params.key_param, searchString, req, res);
});

// GET month/day
router.get('/:key_param?/months/:month_param?/days/:day_param?', function(req, res) {
    searchString = ({ 'Month' : req.params.month_param, 'Day' : req.params.day_param });
    getData(req.params.key_param, searchString, req, res);
});

// GET year
router.get('/:key_param?/years/:year_param?', function(req, res) {
    searchString = ({ 'Year' : req.params.year_param });
    getData(req.params.key_param, searchString, req, res);
});

// GET monthly averages for specified year
router.get('/:key_param?/years/averages/:year_param?', function(req, res) {
    var yearAverageArray = [];

    function getYearAverages(year, month) {
            WeatherModel.find({Month: month, Year: year}, function (err, weatherData) {
                var hiAvg = 0;
                var loAvg = 0;
                var i = 0;

                while (i < weatherData.length) {
                    hiAvg += weatherData[i].Hi;
                    loAvg += weatherData[i].Lo;
                    i++;
                }

                hiAvg = (hiAvg/weatherData.length).toFixed(2);
                loAvg = (loAvg/weatherData.length).toFixed(2);

                yearAverageArray.push({ "Month" : weatherData[0].Month, "avg" : [ { "hi" : hiAvg }, { "lo" : loAvg } ] } );
                finishedArray(yearAverageArray);
            }
        );
    }

    var i = 1;
    while (i <= 12) {
        getYearAverages(req.params.year_param, i);
        i++;
    }

    function finishedArray() {
        if (yearAverageArray.length === 12) {
            //console.log(sortByKey(avgJson, "Day"));
            res.json(sortByKey(yearAverageArray, "Month"));
        }
    }

});

// GET month
router.get('/:key_param?/months/:month_param?', function(req, res) {
    searchString = ({'Month': req.params.month_param});
    getData(req.params.key_param, searchString, req, res);
});

// GET daily records for specified month
router.get('/:key_param?/getRecords/:month_param?', function(req, res) {
    searchString = ({'Month': req.params.month_param});

    var hiMax, loMin, loMax, hiMin;
    var hiMaxYear, loMinYear, loMaxYear, hiMinYear;
    var hiMaxArray = [], loMinArray = [], loMaxArray = [], hiMinArray = [];

    function getRecords(month, day) {

        // record high maximum (record warmest temp)
        WeatherModel.find({ 'Month': month, 'Day': day}).select('Day Hi Year').sort({ 'Hi': -1, 'Year': -1 }).limit(1)
            .exec(function (err, data) {
                if (!err) {
                    hiMaxArray.push({ Day : data[0].Day, hiMax : data[0].Hi, hiMaxYear : data[0].Year });
                    finishedArray(hiMaxArray);
                }
            });

         // record low minimum (coldest warm temp)
        WeatherModel.find({ 'Month': req.params.month_param, 'Day': i}).sort({ 'Lo': 1, 'Year': -1 }).limit(1)
            .exec(function (err, data) {
                    if (!err) {
                        loMinArray.push({ Day : data[0].Day, loMin : data[0].Lo, loMinYear : data[0].Year });
                        finishedArray(loMinArray);
                    }
            });

        // record low daily max (record coldest temp)
        WeatherModel.find({ 'Month': req.params.month_param, 'Day': i}).sort({ 'Hi': 1, 'Year': -1 }).limit(1)
            .exec(function (err, data) {
                    if (!err) {
                        loMaxArray.push({ Day : data[0].Day, loMax : data[0].Hi, loMaxYear : data[0].Year });
                        finishedArray(loMaxArray);
                    }
            });

        // record low minimum (coldest overnight low)
        WeatherModel.find({ 'Month': req.params.month_param, 'Day': i}).sort({ 'Lo': -1, 'Year': -1 }).limit(1)
            .exec(function (err, data) {
                    if (!err) {
                        hiMinArray.push({ Day : data[0].Day, hiMin : data[0].Lo, hiMinYear : data[0].Year });
                        finishedArray(hiMinArray);
                    }
            });

    }

    var i = 1;
    while (i <= daysInMonth[req.params.month_param]) {
        getRecords(parseInt(req.params.month_param), i);
        i++;
    }
    var recordsJson = [];

    function finishedArray(array) {

        if (array.length === daysInMonth[req.params.month_param]) {
            //console.log(sortByKey(avgJson, "Day"));
            var Info;
            if (array == hiMaxArray) {
                Info = 1;
                recordsJson.push({ "Info" : Info, "hiMaxArray" : sortByKey(array, "Day")});
            }
            if (array == loMinArray) {
                Info = 2;
                recordsJson.push({ "Info" : Info, "loMinArray" : sortByKey(array, "Day")});
            }
            if (array == loMaxArray) {
                Info = 3;
                recordsJson.push({ "Info" : Info, "loMaxArray" : sortByKey(array, "Day")});
            }
            if (array == hiMinArray) {
                Info = 4;
                recordsJson.push({ "Info" : Info, "hiMinArray" : sortByKey(array, "Day")});
            }

            if (recordsJson.length == 4) {
                res.json(sortByKey(recordsJson, "Info"));
            }
        }
    }

});

// GET 1981-2010 daily averages for specified month
router.get('/:key_param?/monthsAverage/:month_param?', function(req, res) {

    var avgJson = [];

    function getAvg(month, day) {
        //console.log(month + " " + day);
        WeatherModel.aggregate(
            {
                $match : {  Month : month, Day : day, Year : { $gte : 1981, $lte : 2010 } }
            },
            {   $group : {
                    _id : '$Day',
                    avgHi : { $avg : '$Hi' },
                    avgLo : { $avg : '$Lo' }
                }
            },
            function (err, result) {
                if (!err) {
                    avgJson.push({Day : parseInt(result[0]._id), AvgHi : Math.round(result[0].avgHi), AvgLo : Math.round(result[0].avgLo)});
                    //console.log("result", result);
                    finishedArray();
                } else {
                    console.log(err);
                }
            }
        );
    }

    var i = 1;
    while (i <= daysInMonth[req.params.month_param]) {
        getAvg(parseInt(req.params.month_param), i);
        i++;
    }

    function finishedArray() {
        if (avgJson.length === daysInMonth[req.params.month_param]) {
            //console.log(sortByKey(avgJson, "Day"));
            res.json(sortByKey(avgJson, "Day"));
        }
    }

});

module.exports = router;