var mimeParser = require("./mimeParser");
var Content = require("./Content.js").Content;

var notFoundContentType = mimeParser.getContentType("text");

exports.ContentNotFound = function (path) {
    Content.apply(this, [notFoundContentType, path + " was not found"]);
};
