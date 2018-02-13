var express = require('express')
var router = express.Router()

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
});

router.get('/', function(req, res) {
    res.sendFile('./public/index.html', { root: __dirname });
});

router.get('/login', function(req, res) {
    res.sendFile('./public/login.html', { root: __dirname });
});

router.get('/signup', function(req, res) {
    res.sendFile('./public/signup.html', { root: __dirname });
});

module.exports = router;