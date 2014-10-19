/**
 * Gulp file.
 */
var fs = require("fs"),
  _ = require("lodash"),
  gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  // TODO: Switch back to https://github.com/lazd/gulp-karma when
  // https://github.com/lazd/gulp-karma/pull/22 is merged.
  karma = require("gulp-karma"),
  mocha = require("gulp-mocha"),
  jade = require("gulp-jade"),
  rename = require("gulp-rename"),
  mdox = require("gulp-mdox"),
  rimraf = require("gulp-rimraf");

// ----------------------------------------------------------------------------
// Globals
// ----------------------------------------------------------------------------
// Sauce labs environments.
var SAUCE_ENVS = {
  /*jshint camelcase:false */
  // Already tested in Travis.
  // sl_firefox: {
  //   base: "SauceLabs",
  //   browserName: "firefox"
  // },
  sl_chrome: {
    base: "SauceLabs",
    browserName: "chrome"
  },
  sl_safari: {
    base: "SauceLabs",
    browserName: "safari",
    platform: "OS X 10.9"
  },
  sl_ie_9: {
    base: "SauceLabs",
    browserName: "internet explorer",
    platform: "Windows 7",
    version: "9"
  },
  sl_ie_10: {
    base: "SauceLabs",
    browserName: "internet explorer",
    platform: "Windows 7",
    version: "10"
  },
  sl_ie_11: {
    base: "SauceLabs",
    browserName: "internet explorer",
    platform: "Windows 7",
    version: "11"
  }
  /*jshint camelcase:true */
};

// SauceLabs tag.
var SAUCE_BRANCH = process.env.TRAVIS_BRANCH || "local";
var SAUCE_TAG = process.env.SAUCE_USERNAME + "@" + SAUCE_BRANCH;

// Karma coverage.
var KARMA_COV = {
  reporters: ["mocha", "coverage"],
  preprocessors: {
    "chai-jq.js": ["coverage"]
  },
  coverageReporter: {
    reporters: [
      { type: "json", file: "coverage.json" },
      { type: "lcov" }
    ],
    dir: "coverage/"
  }
};

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
      "test/js/adapters/karma.js",
      "*.js",
      "!gulpfile.js"
    ])
    .pipe(jshint(_jshintCfg(".jshintrc-frontend.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint:test", function () {
  gulp
    .src([
      "test/js/spec/**/*.js"
    ])
    .pipe(jshint(_.merge(_jshintCfg(".jshintrc-frontend.json"), {
      expr: true
    })))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint:backend", function () {
  gulp
    .src([
      "*.js",
      "tasks/**/*.js",
      "test/js/adapters/node.js"
    ])
    .pipe(jshint(_jshintCfg(".jshintrc-backend.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint", ["jshint:frontend", "jshint:test", "jshint:backend"]);

// ----------------------------------------------------------------------------
// Test - Frontend
// ----------------------------------------------------------------------------
// Use `node_modules` Phantom
process.env.PHANTOMJS_BIN = "./node_modules/.bin/phantomjs";

// Test wrapper.
var testFrontend = function () {
  var files = [
    // Libraries
    "test/js/lib/sinon.js",
    "test/js/lib/jquery.js",
    "test/js/lib/chai.js",
    "chai-jq.js",

    // Test setup,
    "test/adapters/karma.js",

    // Tests
    "test/js/spec/chai-jq.spec.js"
  ];

  var opts = _.extend.apply(_, [{
    frameworks: ["mocha"],
    port: 9999,
    reporters: ["mocha"],
    client: {
      mocha: {
        ui: "bdd"
      }
    }
  }].concat(_.toArray(arguments)));

  return function () {
    return gulp
      .src(files)
      .pipe(karma(opts))
      .on("error", function (err) {
        throw err;
      });
  };
};

gulp.task("test:frontend:dev", testFrontend({
  singleRun: true,
  browsers: ["PhantomJS"]
}, KARMA_COV));

gulp.task("test:frontend:ci", testFrontend({
  singleRun: true,
  browsers: ["PhantomJS", "Firefox"]
}, KARMA_COV, {
  reporters: ["mocha", "coverage", "coveralls"]
}));

gulp.task("test:frontend:sauce", testFrontend({
  singleRun: true,
  reporters: ["mocha", "saucelabs"],
  sauceLabs: {
    testName: "chai-jq - Frontend Unit Tests",
    tags: [SAUCE_TAG],
    public: "public"
  },
  // Timeouts: Allow "n" minutes before saying "good enough". See also:
  // https://github.com/angular/angular.js/blob/master/karma-shared.conf.js
  captureTimeout: 0, // Pass through to SL.
  customLaunchers: SAUCE_ENVS,
  browsers: Object.keys(SAUCE_ENVS)
}));

gulp.task("test:frontend:all", testFrontend({
  port: 9998,
  browsers: ["PhantomJS", "Firefox", "Chrome", "Safari"]
}));

// ----------------------------------------------------------------------------
// Test - Backend
// ----------------------------------------------------------------------------
gulp.task("test:backend", function () {
  gulp
    .src("test/adapters/node.js")
    .pipe(mocha({
      ui: "bdd",
      reporter: "spec"
    }))
    .on("error", function (err) {
      throw err;
    });
});

// ----------------------------------------------------------------------------
// Docs
// ----------------------------------------------------------------------------
gulp.task("docs:api", function () {
  gulp
    .src("chai-jq.js")
    .pipe(mdox({
      src: "README.md",
      name: "README.md",
      start: "## Plugin API",
      end: "## Contributions"
    }))
    .pipe(gulp.dest("./"));
});

gulp.task("templates", function () {
  gulp
    .src("_templates/**/*.jade")
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest("./"));
});

// ----------------------------------------------------------------------------
// Copy
// ----------------------------------------------------------------------------
gulp.task("copy", function () {
  gulp
    .src([
      "bower_components/mocha/mocha.js",
      "bower_components/mocha/mocha.css",
      "bower_components/chai/chai.js",
      "bower_components/jquery/dist/jquery.js",
      "bower_components/requirejs/require.js",
      "bower_components/pure/pure-min.css"
    ])
    .pipe(gulp.dest("./test/js/lib"));

  gulp
    .src([
      "bower_components/sinon/index.js"
    ])
    .pipe(rename({
      basename: "sinon"
    }))
    .pipe(gulp.dest("./test/js/lib"));
});

// ----------------------------------------------------------------------------
// Watch
// ----------------------------------------------------------------------------
gulp.task("watch", function () {
  gulp.watch([
    "_templates/**/*.jade",
    "*.md",
    "chai-jq.js"
  ], ["docs:api", "templates"]);
});

// ----------------------------------------------------------------------------
// Clean
// ----------------------------------------------------------------------------
gulp.task("clean", function () {
  gulp
    .src([
      "coverage"
    ], { read: false })
    .pipe(rimraf());
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("check:dev",  ["jshint", "test:backend", "test:frontend:dev"]);
gulp.task("check:ci",   ["jshint", "test:backend", "test:frontend:ci"]);
gulp.task("check:all",  ["jshint", "test:backend", "test:frontend:all"]);
gulp.task("check",      ["check:dev"]);

gulp.task("build",      ["copy", "docs:api", "templates"]);

gulp.task("default",    ["clean", "check", "build"]);
