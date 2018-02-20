app.controller("signupControl", function($scope) {

    $scope.attemptSignup = function (username, email, password) {
        if(email === undefined) {
            $scope.error = "Invalid Email"
            return
        }
        // enter backend
        console.log(username + email + password) 
    }
});