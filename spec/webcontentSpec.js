describe("webcontentSpec", function () {
	var tmpDir = require("os").tmpdir();
	var rootDir = tmpDir + "/web";
	var fs = require("fs");
	var exec = require("child_process").exec;

	beforeAll(function () {
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

	afterAll(function () {
		exec("rm -rf " + rootDir);
	});

	var webcontent;
	beforeEach(function () {
		var WebContent = new require("../webcontent.js").webcontent;
		webcontent = new WebContent(rootDir);
	});

	it("should say whether file exists", function () {
		expect(webcontent.hasFile("/default.html")).toBe(true);
		expect(webcontent.hasFile("/default.css")).toBe(true);
		expect(webcontent.hasFile("/default.js")).toBe(true);

		expect(webcontent.hasFile("/subdir/default.html")).toBe(true);
		expect(webcontent.hasFile("/subdir/default.css")).toBe(true);
		expect(webcontent.hasFile("/subdir/default.js")).toBe(true);
	});

	it("should say whether file doesn't exist", function () {
		expect(webcontent.hasFile("/default2.html")).toBe(false);
		expect(webcontent.hasFile("/subdir/default2.css")).toBe(false);
		expect(webcontent.hasFile("/anotherdir/default.js")).toBe(false);
	});

	it("should provide content to existing files", function () {
		expect(webcontent.getFile("/default.html")).toContain("html");
		expect(webcontent.getFile("/default.css")).toContain("css");
		expect(webcontent.getFile("/default.js")).toContain("function");
	});
});
