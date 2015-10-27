var urlParser = require("url");
var ContentNotFound = require("./ContentNotFound.js").ContentNotFound;

exports.Dispatcher = function (httpHandlers) {
	var findHandler = function (url) {
		for (var i = 0; i < httpHandlers.length; i++) {
			if (httpHandlers[i].canHandle(url)) {
				return httpHandlers[i];
			}
		}
		return null;
	};

	var getResponseStatus = function (response) {
		return response instanceof ContentNotFound ? 404 : 200;
	};

	var doDispatch = function (req, res) {
        var url = urlParser.parse(req.url);
		var handler = findHandler(url);
        var response;
        var status;

		if (handler) {
			response = handler.getContent(url);
		} else {
			throw new Error("There's no handler for current request url: " + req.url);
		}

        status = getResponseStatus(response);

        res.writeHead(status, {"Content-Type": response.type});
        res.write(response.text);
	};

	this.dispatch = function (req, res) {
		try {
			doDispatch(req, res);
		} catch (e) {
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.write("internal error happened");
			res.write("\n");
			res.write(e.message);
			if (e.stack) {
				res.write("\n");
				res.write(e.stack);
			}
		}
		res.end();
	};

};
