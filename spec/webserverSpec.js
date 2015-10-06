var http = require("http");
var WebServer = require("../webserver.js").WebServer;
var Dispatcher = require("../webdispatcher.js").Dispatcher;
var fakeFS = function (contentDictionary) {
	return {
		hasFile: function (path) {
			return path in contentDictionary;
		},
		getFile: function (path) {
			return contentDictionary[path];
		}
	};
};

var makeACall = function (server, path, callback) {
	var request = http.request({
		host: "127.0.0.1",
		path: path,
		port: server.getPort()
	}, function (res) {
		var data = "";

		res.on("data", function (chunk) {
			data += chunk.toString();
		});
		res.on("end", function () {
			callback(null, res, data);
		});
	});

	request.on("error", function (error) {
		callback(error, null);
	});

	request.end();
};

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

		makeACall(server, "/", function (error, response) {
			expect(error).toBe(null);
			expect(response).not.toBeNull();
			done();
		});
	});

});

describe("webserver", function () {
	var server;
	var port = 8081;

	beforeEach(function () {
		var path = "/default.html";
		var content = {
			"/default.html": "/*html*/",
			"/default.css": "/*css*/",
			"/default.js": "/*js*/",
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
			expect(response).not.toBe(null);
			expect(response.headers).not.toBe(null);
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
			expect(response.headers['content-type']).toEqual("text/javascript");
			expect(data).toContain("js");
			done();
		});
		
	});

	xit("should fulfill dependences");
});
