var http = require("http");
var Dispatcher = require("./Dispatcher.js").Dispatcher;

exports.WebServer = function (port, dispatcher) {
	var server;

	if (!dispatcher) {
		dispatcher = new Dispatcher();
	}

	if (!port) {
		throw new Error("Port number cannot be empty");
	}

	this.start = function () {
		server = http.createServer(dispatcher.dispatch);

		server.listen(port);
	};

	this.stop = function () {
		if (server) {
			server.close();
			server = null;
		} else {
			throw new Error("Not running");
		}
	};

	this.isRunning = function () {
		return !!server;
	};
	
	this.getPort = function () {
		return port;
	};
};
