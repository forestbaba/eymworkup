angular.module('myApp').controller('registerController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {
            $scope.register = function ()
            {
                $scope.error = false;
                $scope.disabled = true;
                AuthService.register($scope.registerForm.name,$scope.registerForm.username,$scope.registerForm.email,  $scope.registerForm.password)
                    .then(function () {
                        alert('Registration Successful...');
                        $location.path('/login');
                        $scope.disabled = false;
                        $scope.registerForm = {};
                        console.log('working good')
                    })
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    });
            };

            $scope.closeRegister = function()
            {
                window.location.href='#/';

            }
        }]);
