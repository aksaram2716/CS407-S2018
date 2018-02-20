'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {

        $scope.recipes = [];
        $scope.query = "";

        $scope.loadRecipes = function() {
            $scope.recipes = [];
            //alert("function called");
            $http({
                url: getAPIURL() + "/all/recipes",
                method: "GET",
                params: {
                    q: $scope.query,
                    after: 0,
                    limit: 50
                }
            }).then(function(response) {
                $scope.recipes = response.data;

            }, function errorCallback(response) {
                alert("Something went wrong, try refreshing the page");
            });
        };

        $scope.loadRecipes();

        $scope.favorite = function() {
            alert("Feature to be implemented in sprint 2");
        };

}]);