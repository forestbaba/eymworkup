(function () {
    angular.module('myApp')
        .controller('AdminController', [ '$scope', '$http','$window','$rootScope','Main','$localStorage', function ($scope, $http, $window, $rootScope,Main,$localStorage)
        {
            $scope.loadAdminRegister = function(){
                //$http.delete('/api/sport/'+id).success(function(response){
                window.location.href='#/admin_register';
                //});
            }

            //$scope.registerAdmin = function(){
            //    console.log($scope.sport);
            //    $http.post('/api/admin/register', $scope.admin).then(function(response){
            //        window.location.href='#/admin';
            //    }).then(function(error)
            //    {
            //        console.log(error);
            //    })
            //}

            $scope.admin = {};
            $scope.registerAd = function ()
            {
                $http({
                    method: 'POST',
                    url: '/api/admin/register', data: {name: $scope.admin.name, username: $scope.admin.username, email: $scope.admin.email, passwprd: $scope.admin.password}
                }).then(function (response)
                {
                    $scope.result = response;
                    console.log("datas are :"+ data);

                })
                    .then(function (error)
                    {
                        console.log(error);
                    });

            }


            $scope.admin = {};
            //$rootScope.currentUserSignedIn = false;
            //$rootScope.currentUser.name = null;
            $scope.loginAdmin = function ()
            {

               $http({
                    method: 'POST',
                    //url: '/api/admin/login',
                   url: '/api/admin/authenticate',

                   data: {email:$scope.admin.email, password:$scope.admin.password}
                }).then(function (response)
                {
                    $window.location.href='#/main_page.html';
                    $scope.result = response;
                    console.log("Successful Loged in as :"+ response.token);

                    $rootScope.token = response.token;

                    //$rootScope.currentUserSignedIn = true;
                    //$rootScope.currentUser.name = response.email;

                }).then(function (error)
                    {
                        console.log(error);
                    });

            }







            function successAuth(res) {
                $localStorage.token = res.token;
                window.location = "/";
            }

            $scope.signze = function() {
                var formData = {
                    email: $scope.admin.email,
                    password: $scope.admin.password
                }

                Main.signin(formData, successAuth,function(res)
                    {
                    if (res.type == false)
                    {
                        alert(res.data)
                    } else
                    {
                        $localStorage.token = res.data.token;


                        window.location = "/";
                        console.log(res.data.token)

                        console.log('inside purpose')
                    }
                },
                    function()
                    {
                    $rootScope.error = 'Failed to signin';
                })
            };


            $scope.logout = function()
            {
                Main.logout(function()
                {
                    console.log("logged out");
                    window.location = "/"
                }, function() {
                    alert("Failed to logout!");
                });
            };

            $scope.token = $localStorage.token;

            //  $scope.token = $localStorage.token;
            //$scope.tokenClaims = Main.getUserFromToken();


        }])

        .controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {

            Main.me(function(res)
            {
                $scope.myDetails = res;
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
        }]);







}())
