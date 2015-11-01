var HttpHandler = require("./HttpHandler").HttpHandler;
var Url = require("url");

exports.IndexRedirectHttpHandler = function (staticFileHttpHandler) {
    var canHandle = function (url) {
        return url.pathname === "" || url.pathname === "/";
    };

    var getContent = function (url) {
        var newUrlString = (url.protocol ? url.protocol + "//" : "") + (url.host || "") + "/index.html" + (url.search || "") + (url.hash || "");
        return staticFileHttpHandler.getContent(Url.parse(newUrlString));
    };

    return new HttpHandler(canHandle, getContent);
};
