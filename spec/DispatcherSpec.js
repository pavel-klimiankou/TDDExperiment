var expect = require("expect");
var Dispatcher = require("../src/Dispatcher.js").Dispatcher;

var NOOP = function () {};

var getRequestStub = function (path) {
 	return { url: "http://127.0.0.1" + path, path: path, method: "GET" };
};
var getResponseStub = function () {
	return { end: NOOP, write: NOOP, writeHead: NOOP };
};


describe("webdispatcher", function () {
	it("should be able to dispatch", function () {
		var dispatcher = new Dispatcher();
		expect(dispatcher.dispatch).toBeA(Function);
	});

	it("should redirect static requests to storage provider", function () {
		var fakeFS = {hasFile: NOOP, getFile: NOOP};
        var hasFileSpy = expect.spyOn(fakeFS, "hasFile");
        var getFileSpy = expect.spyOn(fakeFS, "getFile");
		var dispatcher = new Dispatcher(fakeFS);

		path = "/subdir/somePath.html?qString#hash";
		dispatcher.dispatch(getRequestStub(path), getResponseStub());
		expect(hasFileSpy).toHaveBeenCalledWith("/subdir/somePath.html");
		expect(getFileSpy).toNotHaveBeenCalled();
	});

	it("should get content from storage provider", function () {
		var fakeFS = {
				hasFile: function () {return true;},
				getFile: NOOP
            },
            hasFileSpy = expect.spyOn(fakeFS, "hasFile").andReturn(true),
            getFileSpy = expect.spyOn(fakeFS, "getFile");

		var dispatcher = new Dispatcher(fakeFS);
		
		dispatcher.dispatch(getRequestStub("/any-path-will-do.html"), getResponseStub());
		expect(hasFileSpy).toHaveBeenCalled();
		expect(getFileSpy).toHaveBeenCalled();
	});

});
