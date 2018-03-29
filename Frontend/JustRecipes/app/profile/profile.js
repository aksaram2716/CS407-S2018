'use strict';

angular.module('myApp.profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'profile/profile.html',
    controller: 'ProfileCtrl'
  });
}])

.controller('ProfileCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {

        // Sends this header with any AJAX request
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        // Send this header only in post requests. Specifies you are sending a JSON object
        $http.defaults.headers.post['dataType'] = 'json';

        $http.defaults.headers.common["Content-Type"] = "application/json";

        $scope.profile = {};

        $scope.user = {};

        $scope.isLoggedIn = checkUserIsLoggedIn();

        if(!$scope.isLoggedIn) {
            window.location.href = "/";
        }

        $scope.loadProfile = function() {
            $scope.profile = {};
            //alert("function called");
            $http({
                url: getAPIURL() + "/me/profile",
                method: "GET",
                headers: {
                    'Authorization': getAuthString()
                }
            }).then(function(response) {
                $scope.profile = response.data;

            }, function errorCallback(response) {
                alert("Something went wrong, try refreshing the page");
            });
        };

        $scope.loadProfile();

        $scope.logout = function() {
            localStorage.clear();
            window.location.href = "/";
        };

        $scope.changePassword = function() {
            $http({
                url: getAPIURL() + "/me/change-password",
                method: "POST",
                data: {
                    current_password: $scope.user.currentPassword,
                    new_password: $scope.user.newPassword
                },
                headers: {
                    'Authorization': getAuthString()
                }
            }).then(function(response) {
                if(response.status == 200) {
                    alert("Password changed successfully!");
                }
            }, function errorCallback(response) {
                alert("Something went wrong, please make sure your current password is correct and try again");
            });
        };

        $scope.editProfile = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'profile/dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals: {
                    profile: $scope.profile
                }
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        function DialogController($scope, $mdDialog, profile) {
            $scope.profile = profile;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.selectImage = function() {
                function readFile() {

                    if (this.files && this.files[0]) {
                        var FR= new FileReader();
                        FR.addEventListener("load", function(e) {
                            document.getElementById("user-img").src = e.target.result;
                            $scope.profile.profile_image = e.target.result;
                        });
                        FR.readAsDataURL( this.files[0] );
                    }
                }
                document.getElementById("input-image").addEventListener("change", readFile);

                document.getElementById('input-image').click();
            };

            $scope.saveProfile = function() {
                $http({
                    url: getAPIURL() + "/me/profile",
                    method: "PUT",
                    data: {
                        firstname: $scope.profile.firstname,
                        lastname: $scope.profile.lastname,
                        profile_image: $scope.profile.profile_image
                    },
                    headers: {
                        'Authorization': getAuthString()
                    }
                }).then(function(response) {
                    if(response.status == 200) {
                        alert("Profile updated successfully!");
                    }
                }, function errorCallback(response) {
                    alert("Something went wrong, try refreshing the page");
                });
            };
        }
}]);