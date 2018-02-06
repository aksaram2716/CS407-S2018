// index.js

// Set up
var express = require('express');
var app     = express();
var port    = 8080;

// Start app!
app.listen(port)
console.log("Application started and listening on port: " + port);

//Fetch index.html on login
app.get('*', function(req, res){
    res.sendFile('./public/index.html', { root : __dirname});
});