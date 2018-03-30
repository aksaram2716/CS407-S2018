'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.filter('beautifyTimeStamp', function() {
    return function(timestamp) {
        var date = new Date(timestamp);
        var today = new Date();
        var oneDay = 24*60*60*1000;
        var diffDays = Math.round(Math.abs((today.getTime() - date.getTime())/(oneDay)));
        var diffYear = today.getFullYear() - date.getFullYear();
        var sameDay = date.getDay() == today.getDay();

        if(diffDays == 0 && sameDay) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var suffix = null;

            if(hours < 12) {
                suffix = "am";
            } else {
                hours = hours%12;
                suffix = "pm";
            }

            if(hours == 0) {
                hours = 12;
            }

            var minutesStr = "" + minutes;
            if(minutes < 10) {
                minutesStr = "0" + minutes;
            }

            return hours + ":" + minutesStr + " " + suffix;
        } else if(diffDays < 7) {
            var day = date.getDay();
            if(day == 0) {
                return "Sun"
            }
            if(day == 1) {
                return "Mon"
            }
            if(day == 2) {
                return "Tue"
            }
            if(day == 3) {
                return "Wed"
            }
            if(day == 4) {
                return "Thu"
            }
            if(day == 5) {
                return "Fri"
            }
            if(day == 6) {
                return "Sat"
            }
        } else if(diffYear == 0) {
            var month = date.getMonth();
            var monthStr = null;
            if(month == 0) {
                monthStr = "Jan"
            }
            if(month == 1) {
                monthStr = "Feb"
            }
            if(month == 2) {
                monthStr = "Mar"
            }
            if(month == 3) {
                monthStr = "Apr"
            }
            if(month == 4) {
                monthStr = "May"
            }
            if(month == 5) {
                monthStr = "Jun"
            }
            if(month == 6) {
                monthStr = "Jul"
            }
            if(month == 7) {
                monthStr = "Aug"
            }
            if(month == 8) {
                monthStr = "Sep"
            }
            if(month == 9) {
                monthStr = "Oct"
            }
            if(month == 10) {
                monthStr = "Nov"
            }
            if(month == 11) {
                monthStr = "Dec"
            }
            return monthStr + " " + date.toISOString().substring(8, 10);
        } else {
            var dateStr = date.toISOString();
            return dateStr.substring(5, 7) + "/" + dateStr.substring(8, 10) + "/" + dateStr.substring(2, 4);
        }
        return diffDays;
    }
})

.controller('HomeCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {

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

        $scope.loadRecipes = function() {
            if ($scope.isLoggedIn) {
                $scope.loadRecipesForMe();
            } else {
                $scope.loadRecipesForAll();
            }
        };

        $scope.loadRecipes();

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
                        recipe.favorite_count++;
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
                        recipe.favorite_count--;
                        alert("This recipe has been removed from your favorites!");
                    }
                }, function errorCallback(response) {
                    alert("Something went wrong, try refreshing the page");
                });
            }
        };

        $scope.share = function(ev, recipe) {
            if(recipe == null || ev == null) {
                return; //should never get here
            }

            if(!$scope.isLoggedIn) {
                alert("You are not logged in. Please log in to share this recipe with others");
                return;
            }

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('Who would you like to share this recipe with?')
                .textContent('You can add multiple recipients separated by semicolon(s)')
                .placeholder('Email')
                .ariaLabel('Email')
                .initialValue('')
                .targetEvent(ev)
                .ok('Send')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(result) {
                var listOfEmails = result.split(";");

                var cleanList = [];

                for(var index in listOfEmails) {
                    var str = listOfEmails[index];
                    str = str.trim();
                    if(str == null || str == "") {
                        continue;
                    }
                    cleanList.push(str);
                }

                // alert(JSON.stringify(cleanList));

                $http({
                    url: getAPIURL() + "/me/share",
                    method: "POST",
                    data: {
                        user_list: cleanList,
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

            }, function() {
                $scope.status = 'You didn\'t name your dog.';
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
        };

        $scope.viewRecipe = function(recipe) {
            window.location.href = "#!/recipe?id=" + recipe.id;
        }
}]);