var express = require('express')
var router = express.Router()

// Handles typed requests
router.get('/', function (req, res) {
});

router.get('/login*', function (req, res) {
});

router.get('/signup*', function (req, res) {
});

// Handles button events
    res.sendFile('./components/login/login.html', { root: __dirname });
});

    res.sendFile('./components/signup/signup.html', { root: __dirname });
});

    res.sendfile('./components/home/index.html', {root: __dirname});
});

module.exports = router;
