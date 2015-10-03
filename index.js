require('dotenv').load();

var http = require('http');
var path = require('path');
var express = require('express');
var token = require('./token');

var mustacheExpress = require('mustache-express');


// Create Express app and HTTP Server, serve up static HTML/CSS/etc from the
// public directory
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/public');

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

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/host', function (req, res) {
  var roomToken = token.generateToken(req.query.name);
  res.render('host', { token: roomToken, name: req.query.name });
});

app.get('/join', function (req, res) {
  var participantToken = token.generateToken(req.query.name + "-participant");
  res.render('join', { token: participantToken, name: req.query.name });
});
