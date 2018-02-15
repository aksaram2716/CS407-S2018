var express = require('express')
var router = express.Router()

//Handles typed requests
router.get('/', function(req, res) {
    res.sendFile('./public/index.html', { root: __dirname });
});

router.get('/home*', function(req, res) {
    res.sendFile('./public/index.html', { root: __dirname });
});

router.get('/login*', function(req, res) {
    res.sendFile('./public/login.html', { root: __dirname });
});

router.get('/signup*', function(req, res) {
    res.sendFile('./public/signup.html', { root: __dirname });
});

//Handles button events
router.get('/loginPage', function(req, res) {
    res.sendFile('./public/login.html', { root: __dirname });
});

router.get('/signupPage', function(req, res) {
    res.sendFile('./public/signup.html', { root: __dirname });
});

router.get('/homePage', function(req, res) {
    res.sendFile('./public/index.html', { root: __dirname });
});

module.exports = router;