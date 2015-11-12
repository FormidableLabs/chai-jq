/**
 * Gulp file.
 */
var fs = require("fs"),
  _ = require("lodash"),
  gulp = require("gulp"),
  // TODO: Switch back to https://github.com/lazd/gulp-karma when
  // https://github.com/lazd/gulp-karma/pull/22 is merged.
  jade = require("gulp-jade"),
  mdox = require("gulp-mdox");

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
  reporters: ["spec", "coverage"],
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
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("build",      ["docs:api", "templates"]);
gulp.task("default",    ["build"]);
