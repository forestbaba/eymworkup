(function()
{
    function Indexcontroller($scope,$http,$window, $rootScope)
    {
        //var vm = this;
        //vm.logout=logout();

        //function logout()
        //{

        $scope.logout = function(){
            $http.post('/api/logout').success(function(response)
            {
                console.log('logout clicked');
                $rootScope.currentUser = null;
                $window.location.href='/';
            })
            }
       // }

    }

    angular.module('myApp')
        .controller("Indexcontroller",Indexcontroller);
})();