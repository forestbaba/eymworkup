angular.module('myApp').factory('AuthService',
    ['$q', '$timeout', '$http', '$rootScope',

        function ($q, $timeout, $http, $rootScope) {
            var user = null;
            var usex = false;

            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register,
                audioFile: audioFile
            });

            function isLoggedIn()
            {
                if (user) {
                    localStorage.setItem('usex',true);
                    return true
                } else {
                    localStorage.setItem('usex',false);
                    return false;
                }

            }

            function getUserStatus() {
                return $http.get('/user/status')
                    // handle success
                    .success(function (data) {
                        if (data.status) {
                            console.log("The statuses are:  " + data.status)
                            user = true;
                        } else {
                            user = false;
                        }
                    })
// handle error
                    .error(function (data) {
                        user = false;
                    });
            }


            function login(username, password) {
                var deferred = $q.defer();
                $http.post('/login', {username: username, password: password})
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            user = true;
                          var xmen=  localStorage.setItem('usex', data);
                            console.log('localstorage: '+ data);
                            deferred.resolve();
                            $rootScope.currentUser = user;
                            console.log('user is now :' + user);
                        } else {
                            user = false;
                            console.log('user is now :' + user);
                            deferred.reject();
                        }
                    })
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });
// return promise object
                return deferred.promise;
            }


            function logout() {
// create a new instance of deferred
                var deferred = $q.defer();
// send a get request to the server
                $http.get('/logout')
// handle success
                    .success(function (data) {
                        user = false;
                        console.log('user now is: ' + user);
                        deferred.resolve();
                    })
// handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });
// return promise object
                return deferred.promise;
            }


            function register(name, username, email, password) {
// create a new instance of deferred
                var deferred = $q.defer();
// send a post request to the server
                $http.post('/registerMe',
                    {name: name, username: username, email: email, password: password})
// handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
// handle error
                    .error(function (data) {
                        console.log("datat----- " + data)
                        deferred.reject();
                    });
                return deferred.promise;
            }


            function audioFile(title, description, downloadlink)
            {
                var deferred = $q.defer();
                $http.post('/uploadAudio',
                    {title: title, description: description, downloadlink: downloadlink})
                    .success(function (data, status) {
                        deferred.resolve();
                        console.log('uploaded');
                    })
                    .error(function (data) {
                        console.log('Error: ' + data)
                        deferred.reject();
                    });
            }

            function getAudioFiles()
            {
                //var deferred = $q.defer();
                //$http.post('/uploadAudio',
                //    {title: title, description: description, downloadlink: downloadlink})
                //    .success(function (data, status) {
                //        deferred.resolve();
                //        console.log('uploaded');
                //    })
                //    .error(function (data) {
                //        console.log('Error: ' + data)
                //        deferred.reject();
                //    });

                $http.get('/getAudio').success(function (response)
                {
                    console.log("hearing...." + response)
                }).error(function (err) {
                    console.log(err);
                })
            }



        }]);

