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
    console.log("TODO HERE", $, chai);
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
      // AMD: Assumes importing `chai` and `jquery`. Actually **adds** the
      //      plugin to Chai. (Note that alternate plugin AMD impl's return
      //      the plugin function, but **don't** add it).
      //
      // See: https://github.com/chaijs/chai-jquery/issues/27
      define(["jquery", "chai"], function ($, chai) {
        chai.use(function (chai, utils) {
          return plugin(chai, utils, $);
        });
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