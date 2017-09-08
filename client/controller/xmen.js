(function () {
    angular.module('myApp')
        .controller('XMEN', ['$scope', '$http', '$window', '$rootScope', 'Main', '$localStorage', function ($scope, $http, $window, $rootScope, Main, $localStorage) {
            //function successAuth(res) {
            //    //$localStorage.token = res.token;
            //    window.location = "/";
            //}
            $scope.signze = function ()
            {
                $scope.admin = {};
                var formData = {
                    email: $scope.admin.email,
                    password: $scope.admin.password
                }

                Main.signin(formData, function (res)
                    {
                        if (res.type == false)
                        {
                            console.log("Our dara: "+res.data.email);
                            alert("The issue is: "+res.data)
                        }
                        else
                        {
                            $localStorage.token = res.data.token;
                            //$localStorage.token = res.token;



                            window.location = "/";
                            console.log(res.data.token)
                            console.log(res.token)

                            console.log('inside purpose')
                        }
                    },
                    function () {
                        $rootScope.error = 'Failed to signin';
                    })
            };


            $scope.logout = function ()
            {
                console.log("logged out...");
                Main.logout(function () {
                    console.log("logged out");
                    window.location = "/"
                }, function () {
                    alert("Failed to logout!");
                });
            };

            $scope.token = $localStorage.token;

            //  $scope.token = $localStorage.token;
            //$scope.tokenClaims = Main.getUserFromToken();


        }])

        .controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function ($rootScope, $scope, $location, Main) {

            Main.me(function (res) {
                $scope.myDetails = res;
            }, function () {
                $rootScope.error = 'Failed to fetch details';
            })
        }]);


}())
