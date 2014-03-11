/**
 * Gulp file.
 */
var fs = require("fs"),
  gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  karma = require("gulp-karma");

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

gulp.task("test", function () {
  var files = [
    // Libraries
    "test/js/lib/sinon.js",
    "test/js/lib/jquery.js",
    "test/js/lib/chai.js",
    "test/js/chai-jq.js",

    // Test setup,
    "test/test-karma.js",

    // Tests
    "test/js/spec/chai-jq.spec.js"
  ];

  return gulp
    .src(files)
    .pipe(karma({
      frameworks: ["mocha"],
      runnerPort: 9999,
      singleRun: true,
      browsers: ["PhantomJS", "Firefox"],
      reporters: "mocha",
      client: {
        mocha: {
          ui: "bdd"
        }
      }
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task("default", [""]);
