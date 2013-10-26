// Make AMD/Non-AMD compatible (boilerplate).
if (typeof define !== "function") {
  /*global define:true */
  var define = function (deps, callback) {
    // Use global jQuery and Chai for non-AMD shim.
    callback(window.$, window.chai);
  };
}

define(["jquery", "chai"], function ($, chai) {
  describe("chai-jq", function () {
    describe("setup", function () {
      it("patches native chai", function () {
        expect(chai).to.be.ok;
      });
    });
  });
});
