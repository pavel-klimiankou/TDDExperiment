var HttpHandlerFactory = require("../src/HttpHandlerFactory.js").HttpHandlerFactory;
var HttpHandler = require("../src/HttpHandler.js").HttpHandler;
var FakeFS = require("./stubs/FakeFS.js").FakeFS;
var expect = require("expect");

describe("HttpHandlerFactory", function () {

    it("should provide default http handlers set", function () {
        var handlerFactory = new HttpHandlerFactory();
        expect(handlerFactory.getDefaultHandlers).toBeA(Function);
    });

});

describe("HttpHandlerFactory.getDefaultHandlers", function () {
    var handlerFactory;

    beforeEach(function () {
        handlerFactory = new HttpHandlerFactory();
    });

    it("should require webContentRoot argument", function () {
        expect(handlerFactory.getDefaultHandlers).toThrow(/not provided/i);
    });

    describe("getDefaultHandlers result", function () {
        var handlers;

        beforeEach(function () {
            var fakeFS = new FakeFS({});
            handlers = handlerFactory.getDefaultHandlers(fakeFS);
        });

        it("should be array of HttpHandlers", function () {
            expect(handlers).toBeAn(Array);
        });

        it("should contain at least one HttpHandler", function () {
            expect(handlers.length).toBeGreaterThan(0);
            expect(handlers[0]).toBeA(HttpHandler);
        });
    });

});
