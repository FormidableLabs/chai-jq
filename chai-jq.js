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

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    var flag = utils.flag,
      toString = Object.prototype.toString;

    // ------------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------------
    /**
     * Give a more useful element name.
     */
    var _elName = function ($el) {
      var name = "",
        id = $el.attr("id"),
        cls = $el.attr("class") || "";

      // Try CSS selector id.
      if (id) {
        name += "#" + id;
      }
      if (cls) {
        name += "." + cls.split(" ").join(".");
      }
      if (name) {
        return "'" + name + "'";
      }

      // Give up.
      return $el;
    };

    // ------------------------------------------------------------------------
    // Type Inference
    //
    // (Inspired by Underscore)
    // ------------------------------------------------------------------------
    var _isRegExp = function (val) {
      return toString.call(val) === "[object RegExp]";
    };

    // ------------------------------------------------------------------------
    // Comparisons
    // ------------------------------------------------------------------------
    var _equals = function (first, second) {
      return first === second;
    };

    var _regExpMatch = function (re, second) {
      return re.exec(second);
    };

    // ------------------------------------------------------------------------
    // Assertions
    // ------------------------------------------------------------------------

    /**
     * ### .$val(string|regexp)
     *
     * Asserts that the target value matches a string or regular expression.
     *
     *     expect($("foo")).to.have.$val(/^foo/);
     *
     * @name $val
     * @param {String|RegExp} expected value
     * @param {String} message _optional_
     * @api public
     */
    chai.Assertion.addMethod("$val", function (exp, msg) {
      var $el = flag(this, "object"),
        act = $el.val(),
        name = _elName($el),
        comp = _isRegExp(exp) ? _regExpMatch : _equals;

      if (msg) {
        flag(this, "message", msg);
      }

      this.assert(
        comp(exp, act),
        "expected " + name + " to have val #{exp} but got #{act}",
        "expected " + name + " not to have val #{exp}",
        exp,
        typeof act === "undefined" ? "undefined" : act
      );
    });
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