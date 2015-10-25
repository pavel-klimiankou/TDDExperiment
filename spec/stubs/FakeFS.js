exports.FakeFS = function (contentDictionary) {
    var normalizePath = function (path) {
        var path = path.trim();

        return path[0] === "/" ? path.slice(1) : path;
    };

    return {
        hasFile: function (path) {
            return normalizePath(path) in contentDictionary;
        },
        getFile: function (path) {
            return contentDictionary[normalizePath(path)];
        }
    };
};
