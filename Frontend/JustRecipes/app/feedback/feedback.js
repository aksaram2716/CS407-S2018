'use strict';

angular.module('myApp.feedback', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/feedback', {
    templateUrl: 'feedback/feedback.html',
    controller: 'FeedbackCtrl'
  });
}])

.controller('FeedbackCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {

        $scope.text = "";

        $scope.isLoggedIn = checkUserIsLoggedIn();

        if(!$scope.isLoggedIn) {
            window.location.href = "/";
        }

        // Sends this header with any AJAX request
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        // Send this header only in post requests. Specifies you are sending a JSON object
        $http.defaults.headers.post['dataType'] = 'json';

        $http.defaults.headers.common["Content-Type"] = "application/json";

        $scope.submit = function() {
            $http({
                url: getAPIURL() + "/me/feedback",
                method: "POST",
                data: {
                    text: $scope.text
                },
                headers: {
                    'Authorization': getAuthString()
                }
            }).then(function(response) {
                if(response.status == 200) {
                    alert("Thanks for writing to us your valuable opinion :)");
                }
            }, function errorCallback(response) {
                alert("Something went wrong, try refreshing the page");
            });
        };
}]);