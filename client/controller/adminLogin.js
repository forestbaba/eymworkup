//(function()
//{
//    angular.module('myApp')
//        .controller("LoginController",LoginController);
//    function LoginController($scope,$window,$rootScope,UserService)
//    {
//        //$scope.error_message =
//        var lin = this;
//        //$rootScope.currentuser= "";
//        lin.loginAdmin = login;
//            function login (admin)
//        {
//
//            UserService.loginservice(admin, function(response)
//            {
//                if(response == null)
//                {
//                    console.log('error');
//                }
//                else
//                {
//                    $rootScope.cuurentuser = response.name;
//                    console.log('Name is: '+ response.name);
//                    $window.location.href='/profile';
//                }
//
//
//            })
//
//        }
//
//    }
//
//
//})();

angular.module('myApp').controller('loginController',['$scope', '$location', 'AuthService',function ($scope,$location, AuthService, $rootScope) {
            $scope.loginAdmin = function ()
            {
                $scope.error = false;
                $scope.disabled = true;
                AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                    .then(function () {

                        //window.location.href='#/audio';
                        $location.path('#/audio');
                        $scope.disabled = false;
                        $scope.loginForm = {};
                        //$rootScope.currentUser = true;
                        //$scope.currentUser = true;
                        //window.location.href='/';

                    })
                    .catch(function () {
                        $scope.error = true;

                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.disabled = false;
                        $scope.loginForm = {};
                        //$scope.currentUser = false;

                    });
            };

    $scope.loadAdminRegister = function(){
        window.location.href='#/admin_register';
        //});
    }
        }]);
