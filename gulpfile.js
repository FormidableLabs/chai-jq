/**
 * Gulp file.
 */
var fs = require("fs"),
  gulp = require("gulp"),
  jshint = require("gulp-jshint");

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jshintCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// ----------------------------------------------------------------------------
// Tasks
// ----------------------------------------------------------------------------
gulp.task("jshint:frontend", function () {
  gulp
    .src([
      "test/js/spec/**/*.js",
      "*.js",
      "!Gruntfile.js",
      "!gulpfile.js"
    ])
    .pipe(jshint(_jshintCfg(".jshintrc-frontend.json")))
    .pipe(jshint.reporter("default"));
});

gulp.task("jshint:backend", function () {
  gulp
    .src([
      "*.js",
      "tasks/**/*.js",
      "test/js/test-node.js"
    ])
    .pipe(jshint(_jshintCfg(".jshintrc-backend.json")))
    .pipe(jshint.reporter("default"));
});

gulp.task("jshint", ["jshint:frontend", "jshint:backend"]);

gulp.task("default", [""]);
