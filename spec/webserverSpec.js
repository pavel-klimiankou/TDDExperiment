var expect = require("expect");
var WebServer = require("../src/WebServer.js").WebServer;
var Dispatcher = require("../src/Dispatcher.js").Dispatcher;
var makeACall = require("./stubs/makeACall.js").makeACall;
var fakeFS = require("./stubs/FakeFS.js").FakeFS;


describe("basic webserver", function () {
	var port = 8090, 
		server;

	afterEach(function () {
		if (server && server.isRunning()) {
			server.stop();
			server = null;
		}
	});

	it("should be able to start", function () {
		server = new WebServer(port);
		expect(server.start).toBeA(Function);
		expect(server.start()).toBe(undefined);
	});

	it("should require port number", function () {
		expect(function () {new WebServer()}).toThrow();
	});

	it("should be able to stop", function () {
		var server = new WebServer(port);
		expect(server.stop).toBeA(Function);
	});

	it("should say when it's running", function () {
		server = new WebServer(port);
		expect(server.isRunning).toBeA(Function);
		expect(server.isRunning()).toBe(false);
		server.start();
		expect(server.isRunning()).toBe(true);
		server.stop();
		expect(server.isRunning()).toBe(false);
	});

	it("should occupy designated port", function (done) {
		var server = new WebServer(port);
		server.start();

		makeACall(server, "/", function (error, response) {
			expect(error).toBe(null);
			expect(response).toNotBe(null);
			done();
		});
	});

});

describe("webserver", function () {
	var server;
	var port = 8081;

	beforeEach(function () {
		var content = {
			"default.html": "/*html*/",
			"default.css": "/*css*/",
			"default.js": "/*js*/"
		};
		var dispatcher = new Dispatcher(fakeFS(content));

		server = new WebServer(port++, dispatcher);

		server.start();
	});

	afterEach(function () {
		if (server && server.isRunning()) {
			server.stop();
			server = null;
		}
	});

	it("should serve html files", function (done) {
		var path = "/default.html";

		makeACall(server, path, function (error, response, data) {
			expect(error).toBe(null);
			expect(response).toNotBe(null);
			expect(response.headers).toNotBe(null);
			expect(response.headers['content-type']).toEqual("text/html");
			expect(data).toContain("html");
			done();
		});
	});

	it("should serve css files", function (done) {
		makeACall(server, "/default.css", function (error, response, data) {
			expect(error).toBe(null);
			expect(response.headers['content-type']).toEqual("text/css");
			expect(data).toContain("css");
			done();
		});
	});

	it("should serve javascript", function (done) {
		makeACall(server, "/default.js", function (error, response, data) {
			expect(error).toBe(null);
            expect(response.statusCode).toEqual(200);
			expect(response.headers['content-type']).toEqual("text/javascript");
			expect(data).toContain("js");
			done();
		});
		
	});

	it("should fulfill dependences", function (done) {
		makeACall(server, "RequireScripts?i=default.js", function (error, response, data) {
            expect(error).toBe(null);
			expect(response.headers['content-type']).toEqual("text/javascript");
			expect(data).toContain("js");
			done();
		});
	});

});
