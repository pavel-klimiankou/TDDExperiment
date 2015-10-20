var ContentFS = function () {
	this.hasFile = function () {return false;};
	this.getFile = function () {return null;};
};

exports.Dispatcher = function (storageProvider) {
	var mimeParser = require("./mimeParser.js");
	var urlParser = require("url");

	var doDispatch = function (req, res) {
		var url = req.url;
		var path = urlParser.parse(url).pathname;
		var method = req.method;
		var contentType;

		if (method === "GET") {
			if (storageProvider.hasFile(path)) {
				contentType = mimeParser.getContentType(path);
				res.writeHead(200, {"Content-Type": contentType});
				res.write(storageProvider.getFile(path));
			} else {
				res.writeHead(404, {"Content-Type": "text/plain"});
				res.write(path + " was not found");
			}
		} else {
			throw new Error("Unknown http method: " + method);
		}

	};

	if (!storageProvider) {
		storageProvider = new ContentFS();
	}

	this.dispatch = function (req, res) {
		try {
			doDispatch(req, res);
		} catch (e) {
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.write("internal error happened");
			res.write("\n");
			res.write(e.message);
			if (e.stach) {
				res.write("\n");
				res.write(e.stack);
			}
		}
		res.end();
	};

};

