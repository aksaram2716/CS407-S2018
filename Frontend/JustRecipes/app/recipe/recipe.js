'use strict';

angular.module('myApp.recipe', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipe', {
    templateUrl: 'recipe/recipe.html',
    controller: 'RecipeCtrl'
  });
}])

.controller('RecipeCtrl', ['$scope', '$http', function($scope, $http) {

        // Sends this header with any AJAX request
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        // Send this header only in post requests. Specifies you are sending a JSON object
        $http.defaults.headers.post['dataType'] = 'json';

        $http.defaults.headers.common["Content-Type"] = "application/json";

        $scope.recipe = null;
        var videoFrame = document.getElementById("video_frame");
        $scope.recipeId = getParameterByName("id");

        if($scope.recipeId != null && $scope.recipeId != "" && $scope.recipeId != -1) {
            //alert("function called");
            $http({
                url: getAPIURL() + "/all/recipes",
                method: "GET",
                params: {
                    q: "",
                    after: $scope.recipeId - 1, //when we save 'after recipeId -1' it will return the current recipeId
                    limit: 1
                }
            }).then(function(response) {
                if(response != null && response.data.length > 0 && response.data[0] != null) {
                    $scope.recipe = response.data[0];
                    videoFrame.src = $scope.recipe.video_url + "?rel=0&showinfo=0&autoplay=1&enablejsapi=1";
                } else {
                    alert("Seems like the recipe you requested was not found. Redirecting to home page ...");
                    window.location.href = "/";
                }
            }, function errorCallback(response) {
                alert("Something went wrong, try refreshing the page");
            });
        } else {
            alert("Seems like the recipe you requested was not found. Redirecting to home page ...");
            window.location.href = "/";
        }
}]);