/**
 * Gulp file.
 */
var fs = require("fs"),
  _ = require("lodash"),
  gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  karma = require("gulp-karma");
  // ,  mocha = require("gulp-mocha")

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jshintCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// ----------------------------------------------------------------------------
// JsHint
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
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint:backend", function () {
  gulp
    .src([
      "*.js",
      "!Gruntfile.js", // TODO REMOVE
      "tasks/**/*.js",
      "test/js/test-node.js"
    ])
    .pipe(jshint(_jshintCfg(".jshintrc-backend.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint", ["jshint:frontend", "jshint:backend"]);

// ----------------------------------------------------------------------------
// Test - Frontend
// ----------------------------------------------------------------------------
// Use `node_modules` Phantom
process.env.PHANTOMJS_BIN = "./node_modules/.bin/phantomjs";

// Test wrapper.
var testFrontend = function (opts) {
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

  return function () {
    return gulp
      .src(files)
      .pipe(karma(_.extend({
        frameworks: ["mocha"],
        port: 9999,
        reporters: "mocha",
        client: {
          mocha: {
            ui: "bdd"
          }
        }
      }, opts)))
      .on("error", function (err) {
        throw err;
      });
  };
};

gulp.task("test:frontend:dev", testFrontend({
  singleRun: true,
  browsers: ["PhantomJS"]
}));

gulp.task("test:frontend:ci", testFrontend({
  singleRun: true,
  browsers: ["PhantomJS", "Firefox"]
}));

gulp.task("test:frontend:all", testFrontend({
  port: 9998,
  browsers: ["PhantomJS", "Firefox", "Chrome", "Safari"]
}));

// ----------------------------------------------------------------------------
// Test - Backend
// ----------------------------------------------------------------------------
// gulp.task("test:backend", function () {
//   gulp.src("test/js/spec/chai-jq.spec.js")
//     .pipe(mocha({reporter: 'nyan'}));
// });

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("check",      ["jshint", "test:frontend:ci"]);
gulp.task("check:all",  ["jshint", "test:frontend:all"]);
