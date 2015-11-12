"use strict";
/*
 * Karma Configuration: "full" version.
 */
module.exports = function (config) {
  /* eslint-disable global-require */
  config.set({
    frameworks: ["mocha", "phantomjs-shim"],
    reporters: ["spec"],
    browsers: ["PhantomJS"],
    basePath: ".", // repository root.
    files: [
      // Vendor files
      require.resolve("sinon/pkg/sinon"),
      require.resolve("jquery/dist/jquery"),
      require.resolve("chai/chai"),

      // The plugin.
      "chai-jq.js",

      // Test files.
      "test/adapters/karma.js",
      "test/js/spec/chai-jq.spec.js"
    ],
    port: 9999,
    singleRun: true,
    client: {
      mocha: {
        ui: "bdd"
      }
    }
  });
};
