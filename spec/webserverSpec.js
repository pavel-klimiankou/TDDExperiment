var http = require("http");
var WebServer = require("../webserver.js").WebServer;

describe("webserver", function () {
	var server;
	var port = 8081;

	afterEach(function () {
		if (server && server.isRunning()) {
			server.stop();
			server = null;
		}
	});

	it("should be able to start", function () {
		server = new WebServer(port);
		expect(server.start).toEqual(jasmine.any(Function));
		expect(server.start()).toBeUndefined();
	});

	it("should require port number", function () {
		expect(function () {new WebServer()}).toThrow();
	});

	it("should be able to stop", function () {
		var server = new WebServer(port);
		expect(server.stop).toEqual(jasmine.any(Function));
	});

	it("should say when it's running", function () {
		server = new WebServer(port);
		expect(server.isRunning).toEqual(jasmine.any(Function));
		expect(server.isRunning()).toBe(false);
		server.start();
		expect(server.isRunning()).toBe(true);
		server.stop();
		expect(server.isRunning()).toBe(false);
	});

	it("should occupy designated port", function (done) {
		var server = new WebServer(port);

		server.start();

		var request = http.request({
			host: "127.0.0.1",
			port: port
		}, function (response) {
			expect(response).not.toBeNull();
			done();
		});

		request.on("error", function (error) {
			expect(error).toBe(null);
			done();
		});

		request.end();
	});

	xit("should serve html files");
	xit("should serve javascript");
	xit("should serve css files");
	xit("should fulfill dependences");
});
