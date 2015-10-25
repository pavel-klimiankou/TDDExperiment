var HttpHandler = require("./HttpHandler.js").HttpHandler;
var ContentNotFound = require("./ContentNotFound.js").ContentNotFound;

exports.RequestNotHandledHttpHandler = function () {
    var canHandle = function () {
        return true;
    };
    var getContent = function (url) {
        return new ContentNotFound(url.path);
    };

    return new HttpHandler(canHandle, getContent);
};
