var http = require("http");

exports.WebServer = function (port) {
	var server;

	if (!port) {
		throw new Error("Port number cannot be empty");
	}

	this.start = function () {
		server = http.createServer(function (request, response) {
			response.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			response.write("OK");
			response.end();
		});

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
};
