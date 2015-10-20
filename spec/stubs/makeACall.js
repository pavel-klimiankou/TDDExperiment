var http = require("http");

exports.makeACall = function (server, path, callback) {
    var prependWithSlash = function (path) {
            if (path && path[0] !== "/") {
                return "/" + path;
            } else {
                return path;
            }
        },

        request = http.request({
            host: "127.0.0.1",
            path: prependWithSlash(path),
            port: server.getPort()
        }, function (res) {
            var data = "";

            res.on("data", function (chunk) {
                data += chunk.toString();
            });
            res.on("end", function () {
                callback(null, res, data);
            });
        });

    request.on("error", function (error) {
        callback(error, null);
    });

    request.end();
};
