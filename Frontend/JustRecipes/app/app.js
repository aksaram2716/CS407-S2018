'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.login',
  'myApp.profile',
  'myApp.favorites',
  'myApp.recipe',
  'myApp.version',
  'ngMaterial'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/home'});
}])
.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    //$scope.currentNavItem = 'home';
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

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

