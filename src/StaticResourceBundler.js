exports.StaticResourceBundler = function (storageProvider) {
    var fs = storageProvider;
    var bundlePath = "/RequireScripts";
    var jsContentType = require("./mimeParser.js").getContentType("randomfile.js");

    this.canHandle = function (url) {
        return url.pathname === bundlePath;
    };

    this.getContentType = function () {
        return jsContentType;
    };

    this.getContent = function (url) {
        var fileName = url.query.replace("i=", "");

        if (fs.hasFile(fileName)) {
            return fs.getFile(fileName);
        } else {
            return null;
        }
    };
};
