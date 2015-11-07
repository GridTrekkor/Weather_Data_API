app.controller('HomeViewController', function ($http, MenuTitle) {

    var home = this;
    $("#currentWeather").hide();

    home.CurrentDate = new Date();

    home.data = MenuTitle.data;
    MenuTitle.updateTitle('Welcome to the Twin Cities Weather Data & API Application');

    // initialize current conditions object
    home.weather = {};

    home.getWeather = function() {

        $http.jsonp('http://api.wunderground.com/api/a7942b382662121a/geolookup/conditions/forecast/astronomy/q/KMSP.json?callback=JSON_CALLBACK')
            .success(function (data) {

                home.weather.location = data['current_observation']['observation_location']['city'];
                home.weather.temperature = data['current_observation']['temp_f'];
                home.weather.conditions = data['current_observation']['weather'];
                home.weather.dewPoint = data['current_observation']['dewpoint_f'];
                home.weather.humidity = data['current_observation']['relative_humidity'];
                home.weather.windDirection = data['current_observation']['wind_dir'];
                home.weather.windSpeed = data['current_observation']['wind_mph'];
                home.weather.pressure = data['current_observation']['pressure_in'];
                home.weather.conditionsIcon = data['current_observation']['icon_url'];

                if (data['current_observation']['pressure_trend'] == "+") home.weather.pressureTrend = "R";
                if (data['current_observation']['pressure_trend'] == "0") home.weather.pressureTrend = "S";
                if (data['current_observation']['pressure_trend'] == "-") home.weather.pressureTrend = "F";

                $("#currentWeather").show();

            });
        };

    home.getWeather();

});