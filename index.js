require('dotenv').load();

var http = require('http');
var path = require('path');
var express = require('express');
var token = require('./token');

// Create Express app and HTTP Server, serve up static HTML/CSS/etc from the
// public directory
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var server = http.createServer(app);

// Generate a JWT token to use with the video SDK
app.get('/token', function(request, response) {
    // Generate a token for the name requested, with both "listen" and "invite"
    // permissions (the default set of permissions)
    response.send({
        token: token.generateToken(request.query.name)
    });
});

// Initialize the app
token.initialize(function(err) {
    // If there was an error during init, log it and fail
    if (err) return console.error(err);

    // Otherwise start up the app server
    var port = process.env.PORT || 3000;
    server.listen(port, function() {
        console.log('Express server now listening on *:' + port);
    });
});
