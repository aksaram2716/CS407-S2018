// index.js

// Set up
var express = require('express');
var router = require('./routes');
var path = require('path');
var app = express();
var port = 8080;

// Lets us link things in HTML using script and images links if the src
// starts with "/components"
app.use('/components',express.static(__dirname + '/components/'));
// Needed to access the infinite scrolling script and/or other node_modules
app.use('/node_modules',express.static(path.join(__dirname + '/../node_modules/')));

// Start app!
app.listen(port)
console.log("Application started and listening on port: " + port);
//Attach router to app
app.use(router)