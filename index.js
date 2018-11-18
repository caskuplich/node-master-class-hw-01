/**
 * Primary file for the API.
 */

// Dependencies
var http = require('http');
var url = require('url');
var config = require('./config');

// Instantiate the HTTP server
var httpServer = http.createServer(function (req, res) {
	unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.port, function () {
	console.log('The server is listening on port ' + config.port);
});

// All the server logic
var unifiedServer = function(req, res) {
	// Get the URL and parse it
	var parsedUrl = url.parse(req.url, true);

	// Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Choose the handler this request should go to. If one is not found, use the notFound handler
	var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

	// Route the request to the handler specified in the router
	chosenHandler(function(statusCode, payload) {
		// Use the status code called back by the handler, or default to 200
		statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

		// Use the payload called back by the handler, or default to an empty object
		payload = typeof(payload) === 'object' ? payload : {};

		// Convert the payload to a string
		var payloadString = JSON.stringify(payload);

		// Return the response
		res.setHeader('Content-Type', 'application/json');
		res.writeHead(statusCode);
		res.end(payloadString);

		// Log the response
		console.log('Returning this response:', statusCode, payloadString);
	});
}

// Define the handlers
var handlers = {};

// Hello handler
handlers.hello = function(callback) {
	callback(200, { message: 'Welcome to my API!' });
};

// Not found handler
handlers.notFound = function(callback) {
	callback(404)
};

// Define a request router
var router = {
	'hello': handlers.hello
};
