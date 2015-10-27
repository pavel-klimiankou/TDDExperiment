var expect = require("expect");
var http = require("http");
var WebServer = require("../src/WebServer.js").WebServer;
var Dispatcher = require("../src/Dispatcher.js").Dispatcher;
var WebContentRoot = require("../src/WebContentRoot").WebContentRoot;
var HttpHandlerFactory = require("../src/HttpHandlerFactory.js").HttpHandlerFactory;

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

describe("webserver linked to file system", function () {
	var tmpDir = require("os").tmpdir();
	var rootDir = tmpDir + "/web";
	var fs = require("fs");
	var exec = require("child_process").exec;

	before(function () {
		var writeContentSync = function (dir) {
			fs.writeFileSync(dir + "/default.html", "<html></html>");
			fs.writeFileSync(dir + "/default.css", ".css{}");
			fs.writeFileSync(dir + "/default.js", "var script = function () {}");
		};

		var currentDir = rootDir; 

		fs.mkdirSync(currentDir);
		writeContentSync(currentDir);

		currentDir = currentDir + "/subdir";

		fs.mkdirSync(currentDir);
		writeContentSync(currentDir);
	});

	after(function () {
		exec("rm -rf " + rootDir);
	});

	var server;

	beforeEach(function () {
		var webcontent = new WebContentRoot(rootDir);
		var httpHandlers = new HttpHandlerFactory().getDefaultHandlers(webcontent);
		var dispatcher = new Dispatcher(httpHandlers);

		server = new WebServer(9999, dispatcher);
		server.start();
	});

	afterEach(function () {
		server.stop();
	});

	it("should return static html content from root dir", function (done) {
		makeACall(server, "/default.html", function (error, response, content) {
			expect(response.headers["content-type"]).toBe("text/html");
			expect(content).toContain("html");
			done();
		});
	});

	it("should return static html content from sub dir", function (done) {
		makeACall(server, "/subdir/default.html", function (error, response, content) {
			expect(response.headers["content-type"]).toBe("text/html");
			expect(content).toContain("html");
			done();
		});
	});

	it("should return static css content from sub dir", function (done) {
		makeACall(server, "/subdir/default.css", function (error, response, content) {
			expect(response.headers["content-type"]).toBe("text/css");
			expect(content).toContain("css");
			done();
		});
	});

	it("should return static js content from sub dir", function (done) {
		makeACall(server, "/subdir/default.js", function (error, response, content) {
			expect(response.headers["content-type"]).toBe("text/javascript");
			expect(content).toContain("function");
			done();
		});
	});
});
