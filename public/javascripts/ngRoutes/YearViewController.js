app.controller('YearViewController', function($http, MenuTitle) {
    MenuTitle.updateTitle('Year View');

    var year = this;

    // do not show the chart/graph until data is submitted
    year.showGraph = false;

    // initial chart vars
    year.attrs = {};
    year.categories = [];
    year.dataset = [];

    year.avgArray = [{Month:1,avg:[{hi:"22.05"},{lo:"5.18"}]},{Month:2,avg:[{hi:"26.22"},{lo:"9.20"}]},{Month:3,avg:[{hi:"38.93"},{lo:"22.18"}]},{Month:4,avg:[{hi:"56.04"},{lo:"36.49"}]},{Month:5,avg:[{hi:"68.54"},{lo:"48.19"}]},{Month:6,avg:[{hi:"77.99"},{lo:"58.30"}]},{Month:7,avg:[{hi:"83.29"},{lo:"63.41"}]},{Month:8,avg:[{hi:"80.63"},{lo:"61.00"}]},{Month:9,avg:[{hi:"71.64"},{lo:"51.90"}]},{Month:10,avg:[{hi:"58.95"},{lo:"40.30"}]},{Month:11,avg:[{hi:"40.73"},{lo:"25.59"}]},{Month:12,avg:[{hi:"26.98"},{lo:"12.08"}]}];
    console.log(year.avgArray);
    year.monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    year.showYear = function() {
        year.httpYear = year.yearInput;
        // update menu title based on year input
        if (year.httpYear) MenuTitle.updateTitle('Year View: ' + year.httpYear);

        $http.get('/weather/api/years/' + year.httpYear).then(function (data) {
            $http.get('/weather/api/years/averages/' + year.httpYear).then(function(data2) {
                drawYear(data);
                year.currentYearArray = data2.data;
                year.showGraph = true;
            });
        });

        function drawYear(data) {

            // initialze vars to build temperature dataset
            year.dataset[0] = {};
            year.dataset[0].seriesname = "Hi";
            year.dataset[0].data = [];
            year.hiArray = [];

            year.dataset[1] = {};
            year.dataset[1].seriesname = "Lo";
            year.dataset[1].data = [];
            year.loArray = [];

            year.categories = [{"category": [{}]}];

            var k = 0;
            while (k < data.data.length) {
                year.categories[0].category.push({"label": ''});
                //year.hiArray.push(data.data[k].Hi);
                //year.loArray.push(data.data[k].Lo);
                year.dataset[0].data.push({"value" : data.data[k].Hi.toString()});
                year.dataset[1].data.push({"value" : data.data[k].Lo.toString()});
                k++;
            }
            console.log(year.dataset[0]);

            year.attrs = {
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
                "showvalues": "0",
                "showcanvasborder": "0",
                "canvasborderalpha": "0",
                "canvasbordercolor": "CCCCCC",
                "canvasborderthickness": "1",
                "yaxismaxvalue": "100",
                "yaxisminvalue": "-20",
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
                "anchorradius": "0",
                "toolTipBgColor": "00699B",
                "toolTipBgAlpha": "90",
                "showToolTipShadow" : "1",
                "palettecolors": "#FF0000,#0000FF,#FFE6E6,#E6E6FF,#FF0000,#0000FF,#6baa01,#583e78",
                "showborder": "0"
            };

        }
    };

});