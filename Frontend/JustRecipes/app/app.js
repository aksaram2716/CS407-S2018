'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.login',
  'myApp.profile',
  'myApp.favorites',
  'myApp.version',
  'ngMaterial'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/home'});
}])
.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {

      $scope.isLoggedIn = checkUserIsLoggedIn();

}]);

function getAPIURL() {
    return "http://localhost:5005/JustRecipes/api";
}

function getAuthString() {
    return 'Basic ' + btoa(localStorage.getItem("justrecipes_userid") + ":" + localStorage.getItem("justrecipes_apitoken"));
}

function checkUserIsLoggedIn() {
    if (typeof(Storage) !== "undefined") {
        // Retrieve
        var apitoken = localStorage.getItem("justrecipes_apitoken");
        var userid = localStorage.getItem("justrecipes_userid");
        if(apitoken != null && apitoken != "" && userid != null && userid != "") {
            return true;
        }
    } else {
        alert("Sorry you are using a browser or browser version which is not supported by JustRecipes. Please use Chrome for the best experience");
    }
    return false;
}

