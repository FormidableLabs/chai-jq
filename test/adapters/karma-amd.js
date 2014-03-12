/**
 * Karma Setup
 * -----------
 * Duplicate what's normally in "test-amd.html"
 */
// AMD setup.
require.config({
  baseUrl: "js/lib",
  shim: {
    jquery: {
      exports: "$"
    }
  }
});

require(["chai", "../../../chai-jq"], function (chai, plugin) {
  // Inject plugin.
  chai.use(plugin);

  // Set up AMD Chai (just make global for test cases).
  window.expect = chai.expect;

  // Add in specs.
  require(["../spec/chai-jq.spec"], function () {
    mocha.run();
  })
});
