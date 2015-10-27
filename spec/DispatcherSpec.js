var expect = require("expect");
var Dispatcher = require("../src/Dispatcher.js").Dispatcher;

var NOOP = function () {};

var getRequestStub = function (path) {
 	return { url: "http://127.0.0.1" + path, path: path, method: "GET" };
};

var getResponseStub = function () {
	return { end: NOOP, write: NOOP, writeHead: NOOP };
};

var getFakeHttpHandler = function () {
	return {
        canHandle: function () {},
        getContent: function () {}
    };
};

describe("dispatcher", function () {
	it("should be able to dispatch", function () {
		var dispatcher = new Dispatcher();
		expect(dispatcher.dispatch).toBeA(Function);
	});

    it("should dispatch requests to handle that support it", function () {
        var fakeHandler = getFakeHttpHandler();
        var canHandleSpy = expect.spyOn(fakeHandler, "canHandle").andReturn(true);
        var getContentSpy = expect.spyOn(fakeHandler, "getContent");
        var dispatcher = new Dispatcher([fakeHandler]);

        dispatcher.dispatch(getRequestStub("/irrelevant"), getResponseStub());

        expect(canHandleSpy).toHaveBeenCalled();
        expect(getContentSpy).toHaveBeenCalled();
    });

    it("should choose compatible http handler among the others", function () {
        var incompatibleHandler = getFakeHttpHandler();
        var incompatibleCanHandleSpy = expect.spyOn(incompatibleHandler, "canHandle").andReturn(false);
        var incompatibleGetContentSpy = expect.spyOn(incompatibleHandler, "getContent");
        var compatibleHandler = getFakeHttpHandler();
        var compatibleCanHandleSpy = expect.spyOn(compatibleHandler, "canHandle").andReturn(true);
        var compatibleGetContentSpy = expect.spyOn(compatibleHandler, "getContent");
        var dispatcher = new Dispatcher([incompatibleHandler, compatibleHandler]);

        dispatcher.dispatch(getRequestStub("/irrelevant"), getResponseStub());
        expect(incompatibleCanHandleSpy).toHaveBeenCalled();
        expect(incompatibleGetContentSpy).toNotHaveBeenCalled();

        expect(compatibleCanHandleSpy).toHaveBeenCalled();
        expect(compatibleGetContentSpy).toHaveBeenCalled();
    });

    it("should choose the first compatible handler", function () {
        var firstCompatibleHandler = getFakeHttpHandler();
        var firstCompatibleCanHandleSpy = expect.spyOn(firstCompatibleHandler, "canHandle").andReturn(true);
        var firstCompatibleGetContentSpy = expect.spyOn(firstCompatibleHandler, "getContent");
        var secondCompatibleHandler = getFakeHttpHandler();
        var secondCompatibleCanHandleSpy = expect.spyOn(secondCompatibleHandler, "canHandle").andReturn(true);
        var secondCompatibleGetContentSpy = expect.spyOn(secondCompatibleHandler, "getContent");

        var dispatcher = new Dispatcher([firstCompatibleHandler, secondCompatibleHandler]);

        dispatcher.dispatch(getRequestStub("/irrelevant"), getResponseStub());
        expect(firstCompatibleCanHandleSpy).toHaveBeenCalled();
        expect(firstCompatibleGetContentSpy).toHaveBeenCalled();

        expect(secondCompatibleCanHandleSpy).toNotHaveBeenCalled();
        expect(secondCompatibleGetContentSpy).toNotHaveBeenCalled();
    });
});
