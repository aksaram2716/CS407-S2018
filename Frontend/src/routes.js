var express = require('express')
var router = express.Router()

// Handles typed requests
router.get('/', function (req, res) {
    res.sendFile('./components/home/index.html', { root: __dirname });
});

router.get('/login*', function (req, res) {
    res.sendFile('./components/login/login.html', { root: __dirname });
});

router.get('/signup*', function (req, res) {
    res.sendFile('./components/signup/signup.html', { root: __dirname });
});

// Handles button events
router.get('/loginPage', function (req, res) {
    res.sendFile('./components/login/login.html', { root: __dirname });
});

router.get('/signupPage', function (req, res) {
    res.sendFile('./components/signup/signup.html', { root: __dirname });
});

router.get('/homePage', function (req, res) {
    res.sendFile('./components/home/index.html', {root: __dirname});
});

module.exports = router;