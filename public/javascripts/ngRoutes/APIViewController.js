app.controller('APIViewController', function($http, MenuTitle, $location) {

    var api = this;
    api.url = $location.protocol() + "://" + $location.host() + ":" + $location.port();

    //api.message = "This is the API view.";

    MenuTitle.updateTitle('API Specification');

    $http.get('/getApiKey').then(function (apiKeyData) {
        api.userdata = apiKeyData.data;
    });

});