var HttpHandler = require("./HttpHandler").HttpHandler;
var mimeParser = require("./mimeParser.js");
var filePathParser = require("./filePathParser.js");
var Content = require("./Content.js").Content;
var ContentNotFound = require("./ContentNotFound.js").ContentNotFound;

exports.StaticFileHttpHandler = function (webContentRoot) {
    var canHandle = function (url) {
        return filePathParser.isFilePath(url.pathname);
    };

    var getContent = function (url) {
        var filePath = url.pathname;
        var contentType;
        var content;

        if (webContentRoot.hasFile(filePath)) {
            contentType = mimeParser.getContentType(filePath);
            content = webContentRoot.getFile(filePath);
            return new Content(contentType, content);
        } else {
            return new ContentNotFound(filePath);
        }
    };

    return new HttpHandler(canHandle, getContent);
};