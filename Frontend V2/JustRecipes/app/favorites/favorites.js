'use strict';

angular.module('myApp.favorites', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/favorites', {
    templateUrl: 'favorites/favorites.html',
    controller: 'FavoritesCtrl'
  });
}])

.controller('FavoritesCtrl', ['$scope', '$http', function($scope, $http) {

      $scope.isLoggedIn = false;

      if (typeof(Storage) !== "undefined") {
        // Retrieve
        var apitoken = localStorage.getItem("spiceveg_apitoken");
        var userid = localStorage.getItem("spiceveg_userid");
        if(apitoken != null && apitoken != "" && userid != null && userid != "") {
          $scope.isLoggedIn = true;
        } else {
          $scope.isLoggedIn = false;
        }
      } else {
        alert("Sorry you are using a browser or browser version which is not supported by JustRecipes. Please use Chrome for the best experience");
      }

      if(!$scope.isLoggedIn) {
        window.location.href = "/";
      }

}]);