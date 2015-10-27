var StaticFileHttpHandler = require("./StaticFileHttpHandler.js").StaticFileHttpHandler;
var PrefetchDependencyHttpHandler = require("./PrefetchDependencyHttpHandler.js").PrefetchDependencyHttpHandler;
var RequestNotHandledHttpHandler = require("./RequestNotHandledHttpHandler.js").RequestNotHandledHttpHandler;

exports.HttpHandlerFactory = function () {
    this.createStatifFileHttpHandler = function (webContentRoot) {
        return StaticFileHttpHandler(webContentRoot);
    };

    this.createPrefetchDependencyHttpHandler = function (webContentRoot) {
        return PrefetchDependencyHttpHandler(webContentRoot);
    };

    this.createNotFoundHttpHandler = function () {
        return RequestNotHandledHttpHandler();
    };

    this.getDefaultHandlers = function (webContentRoot) {
        if (!webContentRoot) {
            throw new Error("webContentRoot was not provided!");
        } else {
            return [
                this.createStatifFileHttpHandler(webContentRoot),
                this.createPrefetchDependencyHttpHandler(webContentRoot),
                this.createNotFoundHttpHandler()
            ];
        }
    };
};
