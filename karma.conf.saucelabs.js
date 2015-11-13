"use strict";
/*
 * Karma Configuration: "Sauce Labs" version.
 *
 * This configuration is the same as basic one-shot version, just with sauce.
 */
var SAUCE_ENVS = {
  /*eslint-disable camelcase*/
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
  /*eslint-enable camelcase*/
};

// SauceLabs tag.
var SAUCE_BRANCH = process.env.TRAVIS_BRANCH || "local";
var SAUCE_TAG = process.env.SAUCE_USERNAME + "@" + SAUCE_BRANCH;

module.exports = function (config) {
  /* eslint-disable global-require */
  require("./karma.conf.coverage")(config);
  config.set({
    reporters: ["spec", "saucelabs", "coverage"],
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
  });
};

// TODO: CI COVERALLS UPLOAD!!!
