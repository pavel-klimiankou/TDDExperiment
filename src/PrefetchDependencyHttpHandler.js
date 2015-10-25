var Content = require("./Content.js").Content;
var ContentNotFound = require("./ContentNotFound.js").ContentNotFound;
var HttpHandler = require("./HttpHandler.js").HttpHandler;

exports.PrefetchDependencyHttpHandler = function (storageProvider) {
    var fs = storageProvider;
    var bundlePath = "/RequireScripts";
    var mimeParser = require("./mimeParser.js");
    var jsContentType = mimeParser.getContentType("randomfile.js");

    var canHandle = function (url) {
        return url.pathname === bundlePath;
    };

    var getContent = function (url) {
        var fileName = url.query.replace("i=", "");
        var fileContent;

        if (fs.hasFile(fileName)) {
            fileContent = fs.getFile(fileName);
            return new Content(jsContentType, fileContent);
        } else {
            return new ContentNotFound(fileName);
        }
    };

    return new HttpHandler(canHandle, getContent);
};
