'use strict';

angular.module('myApp')
    .factory('Main', ['$http', '$localStorage', function($http, $localStorage){
        //var baseUrl = "http://angular-restful-auth.herokuapp.com";
        var baseUrl = "http://localhost:803";

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        return {
            save: function(data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                //$http.post(baseUrl + '/authenticate', data).success(success).error(error)
                //$http.post('/api/admin/signers', data).success(success).error(error)
                $http.post('/api/admin/authenticate', data).success(success).error(error)

            },
            me: function(success, error)
            {
                //$http.get(baseUrl + '/me').success(success).error(error)
                $http.get( '/api/admin/me').success(success).error(error)

            },
            logout: function(success)
            {
                console.log('inside right away');
                changeUser({});
                console.log("Token 1 is:  "+$localStorage.token);
                delete $localStorage.token;
                console.log("Token 2 is:  "+$localStorage.token);

                success();
            }
        };
    }
]);