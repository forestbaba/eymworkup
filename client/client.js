//var myApp = angular.module('myApp', ['ngRoute']);
//
//myApp.config(function ($routeProvider) {
//    $routeProvider
//        .when('/user/new/',
//        {
//            controller: 'SignUpController',
//            templateUrl: 'views/register.html'
//        })
//        .when('/login', {
//        controller: 'bc',
//        templateUrl: 'views/login.html'
//    })
//
//        .otherwise({
//            redirectTo: '/'
//        });
//});


var theBlog = angular.module('myApp', ['ui.router','ngFileSaver', 'ngFileUpload','ngStorage']);
//var theBlog = angular.module('myApp', ['ui.router', 'ngFileUpload']);


theBlog.config(function ($stateProvider, $urlRouterProvider,$httpProvider,$locationProvider) {
    console.log("coming.....")
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/',
        {
            url: '/',
            templateUrl: 'views/main_page.html'
            //controller: 'selectOptionController'
        })
        .state('home',
        {
            url: '/home',
            templateUrl: 'views/main_page.html'
            //controller: 'selectOptionController'
        })
        .state('audio',
        {
            url: '/audio',
            templateUrl: 'views/audio_message.html',
            controller: 'AudioUploadController'
        })


        .state('about',
        {
            url: '/about',
            templateUrl: 'views/about_page.html',
        })
        .state('downloading',
        {
            url: '/api/downloading/:title',
            templateUrl: 'views/downloading.html',
            controller: 'AudioUploadController'

        })
        .state('admin',
        {
            url: '/admin',
            templateUrl: 'views/admin_login.html',
            controller: 'XMEN'

        })
        .state('admin_register',
        {
            url: '/admin_register',
            templateUrl: 'views/admin_register.html',
            controller: 'AdminController'

        })
        .state('contact',
        {
            url: '/contact',
            templateUrl: 'views/contact.html'
            //controller: 'AdminController'

        })



    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                return $q.reject(response);
            }
        };
    }]);




});
