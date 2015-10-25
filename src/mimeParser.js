exports.getContentType = function (path) {
    var ext;

    if (!path) {
        throw new Error("getResourceContentType cannot be empty");
    } else {
        var matches = path.match(/\.([^.#?/]*)(?=\?|#|$)/);
        ext = (matches && matches[1] || "").toLowerCase();

        switch (ext) {
            case "js":
                return "text/javascript";
            case "css":
                return "text/css";
            case "html":
                return "text/html";
            default:
                return "text/plain";
        }
    }
};
