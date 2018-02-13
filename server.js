// index.js

// Set up
var express = require('express');
var app = express();
var router = require('./routes')
var port = 8080;

// Start app!
app.listen(port)
console.log("Application started and listening on port: " + port);

//Fetch index.html on login
app.get('/', function(req, res) {
    res.sendFile('./public/index.html', { root: __dirname });
});

app.get('/login', function(req, res) {
    res.sendFile('./public/login.html', { root: __dirname });
});

app.get('/signup', function(req, res) {
    res.sendFile('./public/signup.html', { root: __dirname });
});
//app.use('/index', router)