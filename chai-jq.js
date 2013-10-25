/**
 * chai-jq
 * -------
 * An alternate jQuery assertion library for Chai.
 */
(function () {
  /**
   * Chai jQuery plugin implementation.
   */
  function chaiJq(chai, utils, $) {
    "use strict";

    /*jshint devel:true */
    console.log("TODO HERE", $);
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
      define(["jquery"], function ($) {
        return function (chai, utils) {
          return plugin(chai, utils, $);
        };
      });
    } else {
      // Other environment (usually <script> tag): plug in to global chai
      // instance directly.
      chai.use(function (chai, utils) {
        return plugin(chai, utils, window.jQuery);
      });
    }
  }

  // Hook it all together.
  wrap(chaiJq);
}());