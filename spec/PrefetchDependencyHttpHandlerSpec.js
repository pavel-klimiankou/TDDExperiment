var expect = require("expect");
var PrefetchDependencyHttpHandler = require("../src/PrefetchDependencyHttpHandler.js").PrefetchDependencyHttpHandler;
var FakeFS = require("./stubs/FakeFS.js").FakeFS;

describe("PrefetchDependencyHttpHandler", function () {
    var handler;
    var url = require("url").parse;

    beforeEach(function () {
        var content = {
            "default.js": "/*js*/"
        };
        handler = new PrefetchDependencyHttpHandler(new FakeFS(content));
    });

    it("should be able to handle RequireScripts path", function () {
        var uri = url("/RequireScripts?i=default.js");
        expect(handler.canHandle(uri)).toBe(true);
    });

    it("should not be able to handle static resource requests", function () {
        var uri = url("/default.js");
        expect(handler.canHandle(uri)).toBe(false);
    });

    it("should be able to deliver bundled resource", function () {
        var uri = url("/RequireScripts?i=default.js");
        expect(handler.getContent(uri).text).toContain("js");
    });

});