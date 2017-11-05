angular.module('myApp').controller('audioFileController', ['$scope', '$location', 'AuthService','$http',
    function ($scope, $location, AuthService,$http)
    {


        $scope.getAudioFiles = function () {
            $http.get('/getAudio').success(function (response)
            {
                console.log("hearing...." + response)
                $scope.theAudios = response;
            }).error(function (err)
            {
                console.log(err);
            })
        }

        $scope.deleteAudioFile = function(id)
        {
            if(confirm('Are you sure you want to delete this file ? '))
            {
                $http.delete('/audio/' + id).success(function (response)
                {

                    console.log('deleted' + id);
                    window.location.href = '#/audio';
                }).error(function (err) {
                    console.log(err);
                });
            }else
            {
                console.log('you didnt delete ');
            }
        }


        $scope.uploadAudio = function ()
        {
            $scope.$watch(AuthService.isLoggedIn, function (isLoggedIn) {
                $scope.isLoggedIn = isLoggedIn, function (isLoggedIn) {
                    $scope.currentUser = AuthService.currentUser();
                }
            })

            $scope.error = false;
            $scope.disabled = true;
            AuthService.audioFile($scope.audioUploadForm.title, $scope.audioUploadForm.description, $scope.audioUploadForm.downloadlink)
                .then(function () {
                    $location.path('#/audio');
                    $scope.disabled = false;
                    $scope.audioUploadForm = {};
                    $scope.errorMessage = "Audio Inserted Successfully";
                    console.log('we are doing fine again....')
                    //$rootScope.currentUser = true;
                    //$scope.currentUser = true;
                    //window.location.href='/';

                })
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Something went wrong";
                    $scope.disabled = false;
                    $scope.audioUploadForm = {};
                    console.log('No we are not working...')
                    //$scope.currentUser = false;

                });


        };
        //$scope.getAudioFiles = function ()
        //{
        //    AuthService.getAudioFiles().then( function()
        //    {
        //        $scope.audioo = response;
        //        console.log("Up here ...." + response)
        //    })
        //    .catch(function()
        //        {
        //            console.log(err);
        //        })
        //}

    }]);
