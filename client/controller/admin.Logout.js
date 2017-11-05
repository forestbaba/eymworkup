angular.module('myApp').controller('logoutController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
    $scope.logoutAdminOut = function () {
// call logout from service
        AuthService.logout().then(function ()
        {
            window.location.href='/';
            //$location.path('/#audio');
        });
    };
}]);
