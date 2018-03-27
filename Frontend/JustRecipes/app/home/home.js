'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {

        // Sends this header with any AJAX request
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        // Send this header only in post requests. Specifies you are sending a JSON object
        $http.defaults.headers.post['dataType'] = 'json';

        $http.defaults.headers.common["Content-Type"] = "application/json";

        $scope.recipes = [];
        $scope.query = "";

        $scope.isLoggedIn = checkUserIsLoggedIn();

        $scope.loadRecipesForAll = function() {
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

        $scope.loadRecipesForMe = function() {
            $scope.recipes = [];
            //alert("function called");
            $http({
                url: getAPIURL() + "/me/recipes",
                method: "GET",
                params: {
                    q: $scope.query,
                    after: 0,
                    limit: 50
                },
                headers: {
                    'Authorization': getAuthString()
                }
            }).then(function(response) {
                $scope.recipes = response.data;

            }, function errorCallback(response) {
                alert("Something went wrong, try refreshing the page");
            });
        };

        if($scope.isLoggedIn) {
            $scope.loadRecipesForMe();
        } else {
            $scope.loadRecipesForAll();
        }

        $scope.favorite = function(recipe) {
            if(recipe == null) {
                return; //should never get here
            }

            if(!$scope.isLoggedIn) {
                alert("You are not logged in. Please log in to add this recipe to your favorites");
                return;
            }

            if(recipe.favorite == undefined || recipe.favorite == null || !recipe.favorite) {
                $http({
                    url: getAPIURL() + "/me/favorite",
                    method: "POST",
                    data: {
                        id: recipe.id
                    },
                    headers: {
                        'Authorization': getAuthString()
                    }
                }).then(function(response) {
                    if(response.status == 200) {
                        recipe.favorite = true;
                        alert("This recipe has been added to your favorites!");
                    }
                }, function errorCallback(response) {
                    alert("Something went wrong, try refreshing the page");
                });
            } else {
                $http({
                    url: getAPIURL() + "/me/favorite",
                    method: "DELETE",
                    params: {
                        id: recipe.id
                    },
                    headers: {
                        'Authorization': getAuthString()
                    }
                }).then(function(response) {
                    if(response.status == 200) {
                        recipe.favorite = false;
                        alert("This recipe has been removed from your favorites!");
                    }
                }, function errorCallback(response) {
                    alert("Something went wrong, try refreshing the page");
                });
            }
        };

        $scope.share = function(recipe) {
            if(recipe == null) {
                return; //should never get here
            }

            if(!$scope.isLoggedIn) {
                alert("You are not logged in. Please log in to share this recipe with others");
                return;
            }

            alert("Sending email to hardcoded recipients");
            $http({
                url: getAPIURL() + "/me/share",
                method: "POST",
                data: {
                    user_list: ['prithvi.dhelia@gmail.com', 'dhelia@purdue.edu', 'prithvi.dhelia@yahoo.com'],
                    recipe_id: recipe.id
                },
                headers: {
                    'Authorization': getAuthString()
                }
            }).then(function(response) {
                if(response.status == 200) {
                    alert("Success! We shared this via email to those you mentioned");
                }
            }, function errorCallback(response) {
                alert("Something went wrong, try refreshing the page");
            });
        };

        $scope.showCount = function(recipe) {
            if(recipe == null) {
                return; //should never get here
            }

            var message = "";
            if(recipe.favorite_count == 0) {
                message += "No one has saved this recipe, be the first one!";
            } else if(recipe.favorite_count == 1) {
                message += "1 person has saved this recipe to favorites";
            } else if(recipe.favorite_count > 1) {
                message += favorite_count + " people have saved this recie to favorites";
            }

            alert(message);
        }
}]);