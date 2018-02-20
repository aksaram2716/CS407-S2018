app.controller("recipeControl", function($scope) {
    var length = 20;
    $scope.images = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

    $scope.loadMore = function(){
        var last = $scope.images[$scope.images.length - 1];
        for(var i = 1; i <=length; i++){
            $scope.images.push(last + i);
        }
    };
});