var Dispatcher = require("../webdispatcher").Dispatcher;

var NOOP = function () {};

var getRequestFake = function (path) {
 	return { url: "http://127.0.0.1" + path, path: path, method: "GET" };
};
var getResponseStub = function () {
	return { end: NOOP, write: NOOP, writeHead: NOOP };
};


describe("webdispatcher", function () {
	it("should be able to dispatch", function () {
		var dispatcher = new Dispatcher();
		expect(dispatcher.dispatch).toEqual(jasmine.any(Function));
	});

	it("should redirect static requests to storage provider", function () {
		var fakeFS = jasmine.createSpyObj("fakefs", ["hasFile", "getFile"]);
		var dispatcher = new Dispatcher(fakeFS);

		path = "/subdir/somePath.html?qString#hash";
		dispatcher.dispatch(getRequestFake(path), getResponseStub());
		expect(fakeFS.hasFile).toHaveBeenCalledWith("/subdir/somePath.html");
		expect(fakeFS.getFile).not.toHaveBeenCalled();
	});

	it("should get content from storage provider", function () {
		var hasFile = jasmine.createSpy("hasFile"),
			getFile = jasmine.createSpy("getFile"),
				fakeFS = {
				hasFile: function (path) {hasFile(); return true;},
				getFile: getFile
			};

		var dispatcher = new Dispatcher(fakeFS);
		
		dispatcher.dispatch(getRequestFake("/any-path-will-do"), getResponseStub());
		expect(hasFile).toHaveBeenCalled();
		expect(getFile).toHaveBeenCalled();
	});

});
