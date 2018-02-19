app.controller("loginControl", function($scope) {
    $scope.image = {
        path:"https://www.popsci.com/sites/popsci.com/files/styles/1000_1x_/public/import/2013/images/2010/02/duckyduck.jpg?itok=a40QGDbT",
    }
    $scope.accountName = "theBestMallard92";
    $scope.email = "duckingcrazy@hotmail.com"
    $scope.realName= "Dale Flots";
    $scope.username = "fail"
    $scope.password = "empty"

    $scope.attemptLogin = function (username, password) {
        $scope.username = username
        $scope.password = password
    }
});