"use strict";
/*
 * Karma Configuration: "coverage" version.
 *
 * This configuration is the same as basic one-shot version, just with coverage.
 */
module.exports = function (config) {
  /* eslint-disable global-require */
  require("./karma.conf")(config);
  config.set({
    reporters: ["spec", "coverage"],
    coverageReporter: {
      reporters: [
        { type: "json", file: "coverage.json" },
        { type: "lcov" },
        { type: "text-summary" }
      ],
      dir: "coverage/client"
    }
  });
};
