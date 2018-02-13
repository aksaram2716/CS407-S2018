// index.js

// Set up
var express = require('express');
var app = express();
var router = require('./routes')
var port = 8080;

// Start app!
app.listen(port)
console.log("Application started and listening on port: " + port);

//Attach router to app
app.use(router)