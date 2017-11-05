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


var theBlog = angular.module('myApp', ['ui.router']);

theBlog.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider)
{
    console.log("coming.....")
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/',
        {
            url: '/',
            templateUrl: 'views/main_page.html',
            controller: 'logoutController as controller',
            module: 'public'
            //controller: 'selectOptionController'
        })
        .state('home',
        {
            url: '/home',
            templateUrl: 'views/main_page.html',
            module: 'public'
            //controller: 'logoutController as controller'
        })
        .state('audio',
        {
            url: '/audio',
            templateUrl: 'views/audio_file_page.html',
            controller: 'audioFileController as controller'
            //controller: 'AudioUploadController'
        })


        .state('about',
        {
            url: '/about',
            templateUrl: 'views/about_page.html',
            module: 'private'
        })

        .state('admin',
        {
            url: '/admin',
            templateUrl: 'views/admin_login.html',
            controller: 'loginController as controller'

        })
        .state('admin_register',
        {
            url: '/admin_register',
            templateUrl: 'views/admin_register.html',
            controller: 'registerController as controller'
        })
        .state('contact',
        {
            url: '/contact',
            templateUrl: 'views/contact.html'
        })
        .state('profile',
        {
            url: '/profile',
            templateUrl: 'views/profile.html',

        })
})
.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
        //if (  !AuthService.isAuthenticated())
        //{
        //
        //}
        AuthService.getUserStatus().then(function () {
            if (!AuthService.isLoggedIn()) {
                //if (!AuthService.isLoggedIn())
                //{

                //$location.path('/login');
                //$route.reload();
                console.log('-----------------shout---------------');
            }
        });

    });
});

