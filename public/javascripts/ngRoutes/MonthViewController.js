app.controller('MonthViewController', function ($http, MenuTitle) {
    MenuTitle.updateTitle('Month View');

    var month = this;
    month.showGraph = false;

    // set default year
    month.yearInput = new Date().getFullYear();

    month.attrs = {};
    month.categories = [];
    month.dataset = [];

    month.monthNames = ('January February March April May June July August September October November December')
        .split(' ').map(function(monthName) { return { monthName : monthName }; });
    month.daysInMonth = ['', 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    month.showMonthYear = function() {

        month.httpMonth = parseInt(month.monthInput);
        month.httpYear = month.yearInput;
        month.showGraph = false;
        month.showSpinner = true;
        $("#displayDay").hide();

        // update top nav title
        if (month.httpMonth && month.httpYear)  MenuTitle.updateTitle('Month View: ' + monthNames[month.httpMonth] + " " + month.httpYear);

        $http.get('/weather/api/years/' + month.httpYear + '/months/' + month.httpMonth + '/').then(function (data) {
            $http.get('weather/api/monthsAverage/' + month.httpMonth + '/').then(function (data2) {
                $http.get('weather/api/getRecords/' + month.httpMonth + '/').then(function (data3) {
                    drawMonth(data, data2, data3);
                    month.showGraph = true;
                    month.showSpinner = false;
                });
            });
        });

        function drawMonth(data, data2, data3) {

            month.monthName = monthNames[(data.data[0].Month)];
            month.year = data.data[0].Year;
            $("#displayDay").hide();

            // get number of days in month for categories
            month.categories = [{"category": [{}]}];
            var j = 1;
            while (j <= month.daysInMonth[month.httpMonth]) {
                month.categories[0].category.push({"label": j.toString()});
                j++;
            }
            month.categories[0].category.shift();

            // initialize vars to build temperature dataset
            month.dataset[0] = {};
            month.dataset[0].seriesname = "AvgHi";
            month.dataset[0].data = [];
            month.avgHiArray = [];

            month.dataset[1] = {};
            month.dataset[1].seriesname = "AvgLo";
            month.dataset[1].data = [];
            month.avgLoArray = [];

            month.dataset[2] = {};
            month.dataset[2].seriesname = "Hi";
            month.dataset[2].data = [];
            month.hiArray = [];

            month.dataset[3] = {};
            month.dataset[3].seriesname = "Lo";
            month.dataset[3].data = [];
            month.loArray = [];

            // build dataset for average temperature values
            var k = 0;
            while (k < data2.data.length) {
                month.dataset[0].data.push({
                    "value": data2.data[k].AvgHi.toString(),
                    "showValue": "0",
                    "linethickness": "1"
                });
                month.avgHiArray.push(data2.data[k].AvgHi);
                month.dataset[1].data.push({
                    "value": data2.data[k].AvgLo.toString(),
                    "showValue": "0",
                    "linethickness": "1"
                });
                month.avgLoArray.push(data2.data[k].AvgLo);
                k++;
            }

            // build temps for this month
            k = 0, maxValue = -99, minValue = 99;

            var hiMax, hiMaxYear;
            var loMin, loMinYear;
            var loMax, loMaxYear;
            var hiMin, hiMinYear;

            while (k < data.data.length) {

                if (data.data[k].Hi > maxValue) {
                    maxValue = data.data[k].Hi;
                }
                if (data.data[k].Lo < minValue) {
                    minValue = data.data[k].Lo;
                }

                hiMax = data3.data[0].hiMaxArray[k].hiMax;
                hiMaxYear = data3.data[0].hiMaxArray[k].hiMaxYear;

                loMin = data3.data[1].loMinArray[k].loMin;
                loMinYear = data3.data[1].loMinArray[k].loMinYear;

                loMax = data3.data[2].loMaxArray[k].loMax;
                loMaxYear = data3.data[2].loMaxArray[k].loMaxYear;

                hiMin = data3.data[3].hiMinArray[k].hiMin;
                hiMinYear = data3.data[3].hiMinArray[k].hiMinYear;

                //month.dataset[2].data.push({"value" : data.data[k].Hi.toString(), "link" : "JavaScript:displayDay(" + month.httpYear + "," + month.httpMonth + "," + (k+1) + "," + data.data[k].Hi + "," + data.data[k].Lo + "," + data2.data[k].AvgHi + "," + data2.data[k].AvgLo + ")" });
                //month.dataset[3].data.push({"value" : data.data[k].Lo.toString(), "link" : "JavaScript:displayDay(" + month.httpYear + "," + month.httpMonth + "," + (k+1) + "," + data.data[k].Hi + "," + data.data[k].Lo + "," + data2.data[k].AvgHi + "," + data2.data[k].AvgLo + ")" });

                month.dataset[2].data.push({"value" : data.data[k].Hi.toString(), "link" : "JavaScript:displayDay(" + month.httpYear + "," + month.httpMonth + "," + (k+1) + "," + data.data[k].Hi + "," + data.data[k].Lo + "," + data2.data[k].AvgHi + "," + data2.data[k].AvgLo + "," + hiMax + "," + hiMaxYear + "," + loMin + "," + loMinYear + "," + loMax + "," + loMaxYear + "," + hiMin + "," + hiMinYear + ")" });
                month.dataset[3].data.push({"value" : data.data[k].Lo.toString(), "link" : "JavaScript:displayDay(" + month.httpYear + "," + month.httpMonth + "," + (k+1) + "," + data.data[k].Hi + "," + data.data[k].Lo + "," + data2.data[k].AvgHi + "," + data2.data[k].AvgLo + "," + hiMax + "," + hiMaxYear + "," + loMin + "," + loMinYear + "," + loMax + "," + loMaxYear + "," + hiMin + "," + hiMinYear + ")" });
                month.hiArray.push(data.data[k].Hi);
                month.loArray.push(data.data[k].Lo);
                k++;
            }
            //console.log(month.dataset[2]);

            //console.log("max = " + maxValue + " || min = " + minValue);

            month.attrs = {
                "caption": "",
                "subCaption": "",
                "numberprefix": "",
                "plotgradientcolor": "",
                "bgcolor": "FFFFFF",
                "showalternatehgridcolor": "0",
                "numVDivLines": "29",
                "showAlternateVGridColor": "1",
                "alternateVGridColor": "ACF",
                "alternateVGridAlpha": "1",
                "divlinecolor": "DDDDFF",
                "showvalues": "1",
                "showcanvasborder": "0",
                "canvasborderalpha": "0",
                "canvasbordercolor": "CCCCCC",
                "canvasborderthickness": "1",
                "yaxismaxvalue": ((Math.round(maxValue / 10) * 10) + 10),
                "yaxisminvalue": ((Math.round(minValue / 10) * 10) - 10),
                "captionpadding": "30",
                "linethickness": "3",
                "yaxisvaluespadding": "15",
                "legendshadow": "0",
                "legendborderalpha": "0",
                "outCnvBaseFontSize": "13",
                "outCnvBaseFontColor": "000000",
                "adjustDiv": "1",
                "yAxisValuesStep": "1",
                "baseFont" : "Roboto",
                "labelDisplay" : "wrap",
                "showZeroPlaneValue" : "0",
                "toolTipBgColor": "00699B",
                "toolTipBgAlpha": "90",
                "showToolTipShadow" : "1",
                "plotToolText" : "<span class='Tooltip'>" + month.httpMonth + "/$label: $value&deg;</span>",
                "palettecolors": "#FFE6E6,#E6E6FF,#FF0000,#0000FF,#6baa01,#583e78",
                "showborder": "0"
            };

        }

    };

});
