(function () {
    angular.module('myApp')
        .controller('AudioUploadController', ['Upload', 'FileSaver', 'Blob', '$scope', '$http', '$stateParams', '$window', '$rootScope', 'Main', '$localStorage',
            function (Upload, FileSaver, Blob, $scope, $http, $stateParams, $window,$rootScope, Main, $localStorage) {
            //$scope.user = "Admin";
            console.log("upload controller sited");

            $scope.$watch(function ()
                {
                    return $scope.file
                },
                function ()
                {
                    $scope.upload($scope.file);
                });


            $scope.submit = function () {
                if ($scope.form.file.$valid && $scope.file) {
                    $scope.upload($scope.file);
                }
            };


            $scope.audio = {};
            $scope.upload = function (file)
            {

                if (file) {
                    Upload.upload(
                        {
                            url: 'http://localhost:803/api/upload',
                            method: 'POST',
                            data: {file: file, title: $scope.audio.title, description: $scope.audio.description},

                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progrness: ' + progressPercentage + '% ' + evt.config.data.file.name);

                        }).success(function (response) {
                            //uploadSuccessfulDialog();
                            $window.alert( 'Audio uploaded...  ');
                            $window.location.reload();

                            console.log("responses are: " + response)
                        }).error(function (error) {
                            console.log(error);
                        })

                }
            };


            $scope.getAudioFiles = function () {
                $http.get('/api/upload/get').success(function (response) {
                    console.log("hearing...." + response)
                    $scope.audioo = response;
                }).error(function (err) {
                    console.log(err);
                })
            }


            $scope.downloadAudio = function (title) {
                //$http.get('http://localhost:803/api/download/' + $stateParams.title, {fileData: $scope.fileData}) // Send a request using the current routes ID and pass through some data to include in the created file
                //    //console.log('am clicked pls')
                //    //$http.get('http://localhost:803/api/download/' + $stateParams.title) // Send a request using the current routes ID and pass through some data to include in the created file
                //
                //    .success(function (data) {
                //        if (data.success)  // File has been successfuly created...
                //        {
                //            console.log('consumer...')
                //            res.json({state:200})
                //            $window.open('api/file/' + $stateParams.title); // Open the file serving route in a new window/tab so we don't navigate away from this page
                //        }
                //    })
                //    .error(function (data) {
                //        // Handle Error
                //    });

                var filname = $stateParams.downloadlink;

                $http({
                    //url: 'http://localhost:803/api/download/' + 'mind',
                    url: 'http://localhost:803/api/download/' + title,
                    method: "GET",
                    data: {
                        fileData: $scope.fileData
                        //uri: uri
                    },
                    responseType: 'blob'
                }).success(function (data, status, headers, config) {
                    var blob = new Blob([data], {type: 'audio/mp3'});
                    var fileName = headers('content-disposition');
                    //$window.open('api/file/' + $stateParams.title);
                    // $window.open('api/download/:' + $stateParams.title);

                    FileSaver.saveAs(blob, fileName);
                }).error(function (data, status, headers, config) {
                    console.log('Unable to download the file ' + config)
                });
            }


            //$scope.deleteFile = function(idx) {
            //    //var file = $scope.files[idx];
            //    var file = $scope.files[idx];
            //
            //    if (file.isUploaded) {
            //        $http.delete('/api/upload/get'+file.id).then(function(response)
            //        {
            //            if (response.status == 200)
            //            {
            //                $scope.files.splice(idx, 1);
            //            }
            //        });
            //    } else {
            //        $scope.files.splice(idx, 1);
            //    }
            //}


                function uploadSuccessfulDialog() {
                    if ($window.alert("File Uploaded Successfully..."))
                    {
                        window.location.href='#/audio_message';
                        //var songdata = param.$index;
                        //$scope.Message = "You clicked YES.";
                    }
                    //else {
                    //    $scope.Message = "You clicked NO.";
                    //}
                }

            $scope.ShowConfirm = function () {
                if ($window.confirm("Are you sure you want to delete this file?")) {
                    //var songdata = param.$index;
                    deleteFile($index);
                    $scope.Message = "You clicked YES.";
                } else {
                    $scope.Message = "You clicked NO.";
                }
            }


            //$scope.deleteFile = function(idx) {
            $scope.deleteTheFile = function () {

                var file = $scope.files[idx];
                //if (file.isUploaded) {
                if (file) {

                    //$http.delete('http://localhost:803/api/download/' + $stateParams.title).then(function (response) {
                    $http.delete('http://localhost:803/api/download/' + title).then(function (response) {


                        //$http.delete('/api/files/'+file.id).then(function(response){
                        if (response.status == 200) {
                            $scope.files.splice(title, 1);
                        }
                    }).success(function (response) {

                    })
                } else {
                    $scope.files.splice(idx, 1);
                }
            }


                $scope.audio = {};

            $scope.deleteFile = function (id) {
                console.log('am clicked.....')
                $http({
                    method: 'DELETE',
                    //url: '/api/upload/' + pId
                    url: 'http://localhost:803/api/download/' + id
                }).then(function (response) {
                    var data = response.data;
                    $window.alert( 'Audio deleted.....  ');
                    $window.location.reload();
                    //window.location.href='#views/audio_message.html';

                    //Showing Success message
                    console.log("The file Deleted Successfully!!!")
                    $scope.status = "The file Deleted Successfully!!!";
                    //Loading people to the $scope
                    //getAudioFiles();
                    console.log(data);
                }),function err (response) {
                    //Showing error message
                    console.log('Error message is: ' + response.status.text);
                    //$scope.status = 'Unable to delete the File: ' + error.message;
                };
            }













            //where token resides


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



        }])


        .controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function ($rootScope, $scope, $location, Main) {

            Main.me(function (res) {
                $scope.myDetails = res;
            }, function () {
                $rootScope.error = 'Failed to fetch details';
            })
        }]);


    //$scope.registerAdmin = function () {
    //    $http({
    //        method: 'POST',
    //        url: '/api/admin/register',
    //        data: {name: $scope.name, username: $scope.username, email: $scope.email, passwprd: $scope.password}
    //    }).then(function (response) {
    //        $scope.result = response;
    //
    //    })
    //        .then(function (error) {
    //            console.log(error);
    //        })
    //
    //}




}())
