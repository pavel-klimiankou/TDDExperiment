var StaticResourceBundler = require("./StaticResourceBundler.js").StaticResourceBundler;
var StaticFileHttpHandler = require("./StaticFileHttpHandler.js").StaticFileHttpHandler;
var urlParser = require("url");
var ContentNotFound = require("./ContentNotFound.js").ContentNotFound;
var Content = require("./Content.js").Content;

exports.Dispatcher = function (webContentRoot) {
    var staticFileHandler = new StaticFileHttpHandler(webContentRoot);
	var resourceBundler = new StaticResourceBundler(webContentRoot);

	var doDispatch = function (req, res) {
        var url = urlParser.parse(req.url);
        var response;
        var status;

        if (staticFileHandler.canHandle(url)) {
            response = staticFileHandler.getContent(url);
        } else if (resourceBundler.canHandle(url)) {
            var contentType = resourceBundler.getContentType(url);
            var text = resourceBundler.getContent(url);
            response = new Content(contentType, text);
        } else {
            response = new ContentNotFound(url.path);
        }

        status = response instanceof ContentNotFound ? 404 : 200;

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
			if (e.stach) {
				res.write("\n");
				res.write(e.stack);
			}
		}
		res.end();
	};

};

