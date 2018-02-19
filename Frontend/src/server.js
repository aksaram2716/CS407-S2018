// index.js

// Set up
var express = require('express');
var app = express();
var router = require('./routes')
var port = 8080;

// Lets us link things in HTML using script and images links if the src
// starts with "/components"
app.use('/components',express.static(__dirname + '/components/'));

// Start app!
app.listen(port)
console.log("Application started and listening on port: " + port);

//Attach router to app
app.use(router)