var app = angular.module('weatherApp', ['ng-fusioncharts', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider

        .when('/register', {
            templateUrl: '/views/register.html',
            controller: 'RegisterController',
            controllerAs: 'register'
        })
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'HomeViewController',
            controllerAs: 'home'
        })
        .when('/year', {
            templateUrl: '/views/year.html',
            controller: 'YearViewController',
            controllerAs: 'year'
        })
        .when('/month', {
            templateUrl: '/views/month.html',
            controller: 'MonthViewController',
            controllerAs: 'month'
        })
        .when('/api', {
            templateUrl: '/views/api.html',
            controller: 'APIViewController',
            controllerAs: 'api'
        });

    $locationProvider.html5Mode(true);

});
