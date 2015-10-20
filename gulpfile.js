var gulp = require("gulp");
var shell = require("gulp-shell");
var watch = require("gulp-watch");

var ignoreShellErrors = {ignoreErrors: true};
var mochaTask = shell.task(["mocha spec/*.js"], ignoreShellErrors);

gulp.task("test", mochaTask);
gulp.task("watch", function () {
    watch("**/*.js", mochaTask);
});
gulp.task("default", ["test"]);
