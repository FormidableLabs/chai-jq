/**
 * chai-jq
 * -------
 * An alternate jQuery assertion library for Chai.
 */
(function () {
  /**
   * Chai jQuery plugin implementation.
   */
  function chaiJq(chai, utils) {
    "use strict";

  }

  /**
   * Wrap AMD, etc. using boilerplate.
   */
  function wrap(plugin) {
    "use strict";
    /* global module:false */

    if (typeof require === "function" &&
        typeof exports === "object" &&
        typeof module  === "object") {
      // NodeJS
      module.exports = plugin;
    } else if (typeof define === "function" && define.amd) {
      // AMD
      define(function () {
        return plugin;
      });
    } else {
      // Other environment (usually <script> tag): plug in to global chai
      // instance directly.
      chai.use(plugin);
    }
  }

  // Hook it all together.
  wrap(chaiJq);
}());