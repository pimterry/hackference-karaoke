var util = require('util');
var twilio = require('./node-private-signal-beta');

// Fetch a signing key from the Twilio REST API, which we'll use to mint our 
// access tokens below in exports.generateToken
var SIGNING_KEY_SID, SIGNING_KEY_SECRET;

exports.initialize = function(callback) {
    // Initialize Twilio REST API client with our account SID and auth token
    var client = new twilio.RestClient(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    // Create a signing key and store the values in module-level variables for
    // later use in creating access tokens
    client.signingKeys.create({
        friendlyName: 'Hackference'
    }, function(err, data) {
        // fire the callback right away on error
        if (err) return callback.call(this, err);

        // Store returned values from API
        SIGNING_KEY_SID = data.sid;
        SIGNING_KEY_SECRET = data.secret;

        // Fire callback indicating things are ready to go
        callback.call(this);
    });
};

// Helper function to generate an access token to enable a client to use Twilio 
// Video in the browser. Grants limited permissions to use
// Twilio back end services for NAT traversal and general "endpoint" services
// like listening for inbound calls and initiating outbound calls.
exports.generateToken = function(name) {
    var token = new twilio.AccessToken(
        // Sid for the signing key we generated on init
        SIGNING_KEY_SID,
        // your regular account SID
        process.env.TWILIO_ACCOUNT_SID,
        SIGNING_KEY_SECRET
    );

    // Add the capabilities for conversation endpoints to this token, including
    // it's unique name. We'll use the default permission set of "listen" and 
    // "invite"
    token.addEndpointGrant(name);

    // Authorize the client to use Twilio's NAT traversal service - for that,
    // it will need access to the "Tokens" resource
    var resUrl = 'https://api.twilio.com/2010-04-01/Accounts/%s/Tokens.json';
    var grantUrl = util.format(resUrl, process.env.TWILIO_ACCOUNT_SID);
    token.addGrant(grantUrl);

    // Generate a JWT token string that will be sent to the browser and used
    // by the Conversations SDK
    return token.toJwt();
};
