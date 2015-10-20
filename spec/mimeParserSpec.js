var expect = require("expect");
var mimeParser = require("../src/mimeParser.js");

describe("MIME parser", function () {
	it("should recognize text/html from html", function () {
		var path = "/file/default.html";
		expect(mimeParser.getContentType(path)).toEqual("text/html");

		path = "default.html";
		expect(mimeParser.getContentType(path)).toEqual("text/html");

		path = "http://127.0.0.1/default.html#somehash";
		expect(mimeParser.getContentType(path)).toEqual("text/html");

		path = "http://127.0.0.1/default.html?somequery";
		expect(mimeParser.getContentType(path)).toEqual("text/html");

		path = "http://127.0.0.1/default.html?somequery#somehash";
		expect(mimeParser.getContentType(path)).toEqual("text/html");
	});

	it("should recognize text/css from css", function () {
		var path = "/file/default.css";
		expect(mimeParser.getContentType(path)).toEqual("text/css");

		path = "http://127.0.0.1/default.css?somequery#somehash";
		expect(mimeParser.getContentType(path)).toEqual("text/css");
	});

	it("should recognize text/javascript for js", function () {
		var path = "/file/default.js";
		expect(mimeParser.getContentType(path)).toEqual("text/javascript");

		path = "http://127.0.0.1/default.js?somequery#somehash";
		expect(mimeParser.getContentType(path)).toEqual("text/javascript");
	});
});
