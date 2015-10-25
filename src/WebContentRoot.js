exports.WebContentRoot = function (rootDir) {
	var fs = require("fs");

	var getFullPath = function (path) {
		return rootDir + path;
	};

	this.hasFile = function (path) {
		var fullPath = getFullPath(path);
		return fs.existsSync(fullPath);
	};

	this.getFile = function (path) {
		var fullPath = getFullPath(path);
		return fs.readFileSync(fullPath).toString();
	};
};
