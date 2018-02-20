'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {

        // Sends this header with any AJAX request
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        // Send this header only in post requests. Specifies you are sending a JSON object
        $http.defaults.headers.post['dataType'] = 'json';

        $http.defaults.headers.common["Content-Type"] = "application/json";


        $scope.form = {
            radio : "login"
        };

        $scope.signup = function() {
            $http({
                url: getAPIURL() + "/all/signup",
                method: "POST",
                data: {
                    firstname: $scope.signup.firstname,
                    lastname: $scope.signup.lastname,
                    email: $scope.signup.email,
                    password: $scope.signup.password
                }
            }).then(function(response) {
                if(response.status == 200) {
                    // Check browser support
                    if (typeof(Storage) !== "undefined") {
                        // Store
                        localStorage.setItem("spiceveg_userid", response.data.userId);
                        localStorage.setItem("spiceveg_apitoken", response.data.apitoken);

                        window.location.href = "/";
                    } else {
                        alert("Sorry you are using a browser or browser version which is not supported by JustRecipes. Please use Chrome for the best experience");
                    }
                }
            }, function errorCallback(response) {
                if(response.status == 463) {
                    alert("Invalid credentials. Please try again");
                } else {
                    alert("Something went wrong, try refreshing the page");
                }
            });
        };

        $scope.login = function() {
            $http({
              url: getAPIURL() + "/all/login",
              method: "POST",
              data: {
                  email: $scope.login.email,
                  password: $scope.login.password
              }
            }).then(function(response) {
                if(response.status == 200) {
                    // Check browser support
                    if (typeof(Storage) !== "undefined") {
                        // Store
                        localStorage.setItem("spiceveg_userid", response.data.userId);
                        localStorage.setItem("spiceveg_apitoken", response.data.apitoken);

                        window.location.href = "/";
                    } else {
                        alert("Sorry you are using a browser or browser version which is not supported by JustRecipes. Please use Chrome for the best experience");
                    }
                }
            }, function errorCallback(response) {
                if(response.status == 463) {
                    alert("Invalid credentials. Please try again");
                } else {
                    alert("Something went wrong, try refreshing the page");
                }
            });
        };

        $scope.resetPassword = function() {
            alert("Reset Password is not yet implemented");
        };
}]);