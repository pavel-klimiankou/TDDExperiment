var ContentNotFound = require("../src/ContentNotFound.js").ContentNotFound;
var Content = require("../src/Content.js").Content;
var StaticFileHttpHandler = require("../src/StaticFileHttpHandler.js").StaticFileHttpHandler;
var Url = require("url");
var expect = require("expect");
var FakeFS = require("./stubs/FakeFS.js").FakeFS;

describe("StaticFileHttpHandler", function () {
    var handler;
    var url = Url.parse;

    beforeEach(function () {
        handler = new StaticFileHttpHandler(new FakeFS({}));
    });

    it("should be a HttpHandler", function () {
        expect(handler.canHandle).toBeA(Function);
        expect(handler.getContent).toBeA(Function);
    });

    it("should be able to accept file requests", function () {
        expect(handler.canHandle(url("/default.html"))).toBe(true);
        expect(handler.canHandle(url("/dir/theme.css"))).toBe(true);
        expect(handler.canHandle(url("/src/lib/main.1.2.3.css"))).toBe(true);
    });

    it("should reject non-file requests", function () {
        expect(handler.canHandle(url("/\\#"))).toBe(false);
        expect(handler.canHandle(url(""))).toBe(false);
        expect(handler.canHandle(url("/RequiredScripts"))).toBe(false);
    });
});

describe("StaticFileHttpHandler content delivery", function () {
    var handler;
    var url = Url.parse;

    beforeEach(function () {
        var content = {"default.html": "html"};
        handler = new StaticFileHttpHandler(new FakeFS(content));
    });

    it("should return ContentNotFound for unknown paths", function () {
        var uri = url("/default2.html");
        var responseContent = handler.getContent(uri);
        expect(responseContent).toBeA(ContentNotFound);
    });

    it("should return Content for known paths", function () {
        var uri = url("/default.html");
        var responseContent = handler.getContent(uri);

        expect(responseContent).toBeA(Content);
        expect(responseContent).toNotBeA(ContentNotFound);
        expect(responseContent.text).toContain("html");
        expect(responseContent.type).toContain("text/html");
    });

});