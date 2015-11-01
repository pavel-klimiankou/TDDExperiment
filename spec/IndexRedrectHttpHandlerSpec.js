var IndexRedirectHttpHandler = require("../src/IndexRedirectHttpHandler").IndexRedirectHttpHandler;
var url = require("url");
var FakeFS = require("./stubs/FakeFS.js").FakeFS;
var expect = require("expect");
var HttpHandlerFactory = require("../src/HttpHandlerFactory.js").HttpHandlerFactory;

describe("IndexRedirectHttpHandlerSpec", function () {
    var handler;

    beforeEach(function () {
        var fs = new FakeFS({"index.html": "index"});
        var staticContentHandler = new HttpHandlerFactory().createStaticFileHttpHandler(fs);
        handler = new IndexRedirectHttpHandler(staticContentHandler);
    });

    it("should support empty urls", function () {
        var emptyUrl1 = url.parse("http://127.0.0.1");
        var emptyUrl2 = url.parse("http://127.0.0.1/");
        var emptyUrl3 = url.parse("http://127.0.0.1/?abc=cde");
        var emptyUrl4 = url.parse("http://127.0.0.1/?abc=cde#hash");
        var emptyUrl5 = url.parse("http://127.0.0.1/#hash");

        expect(handler.canHandle(emptyUrl1)).toBe(true);
        expect(handler.canHandle(emptyUrl2)).toBe(true);
        expect(handler.canHandle(emptyUrl3)).toBe(true);
        expect(handler.canHandle(emptyUrl4)).toBe(true);
        expect(handler.canHandle(emptyUrl5)).toBe(true);
    });

    it("should not support full paths", function () {
        var nonEmptyUrl = url.parse("http://127.0.0.1/index.html");

        expect(handler.canHandle(nonEmptyUrl)).toBe(false);
    });

    it("should redirect empty urls to index.html", function () {
        var emptyUrl1 = url.parse("http://127.0.0.1");
        var emptyUrl2 = url.parse("http://127.0.0.1/");

        expect(handler.getContent(emptyUrl1).text).toContain("index");
        expect(handler.getContent(emptyUrl2).text).toContain("index");
    });

    it("should redirect preserving query and hash", function () {
        var getContent = expect.createSpy();
        var fakeStaticHandler = {canHandle: function () { return true; }, getContent: function (url) {return getContent(url.href);}};
        var handler = new IndexRedirectHttpHandler(fakeStaticHandler);
        var complexUrl = url.parse("http://127.0.0.1/?abc=cde#somehash");

        handler.getContent(complexUrl);
        expect(getContent).toHaveBeenCalledWith("http://127.0.0.1/index.html?abc=cde#somehash");
    });
});
