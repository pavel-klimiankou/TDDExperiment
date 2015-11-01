var StaticFileHttpHandler = require("./StaticFileHttpHandler.js").StaticFileHttpHandler;
var PrefetchDependencyHttpHandler = require("./PrefetchDependencyHttpHandler.js").PrefetchDependencyHttpHandler;
var RequestNotHandledHttpHandler = require("./RequestNotHandledHttpHandler.js").RequestNotHandledHttpHandler;
var IndexRedirectHttpHandler = require("./IndexRedirectHttpHandler.js").IndexRedirectHttpHandler;

exports.HttpHandlerFactory = function () {
    this.createStaticFileHttpHandler = function (webContentRoot) {
        return StaticFileHttpHandler(webContentRoot);
    };

    this.createPrefetchDependencyHttpHandler = function (webContentRoot) {
        return PrefetchDependencyHttpHandler(webContentRoot);
    };

    this.createNotFoundHttpHandler = function () {
        return RequestNotHandledHttpHandler();
    };

    this.createIndexRedirectHttpHandler = function (staticFileHttpHandler) {
        return new IndexRedirectHttpHandler(staticFileHttpHandler);

    };

    this.getDefaultHandlers = function (webContentRoot) {
        if (!webContentRoot) {
            throw new Error("webContentRoot was not provided!");
        } else {
            return [
                this.createStaticFileHttpHandler(webContentRoot),
                this.createPrefetchDependencyHttpHandler(webContentRoot),
                this.createIndexRedirectHttpHandler(this.createStaticFileHttpHandler(webContentRoot)),
                this.createNotFoundHttpHandler()
            ];
        }
    };
};
