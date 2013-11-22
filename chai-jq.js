/*!
 * chai-jq
 * -------
 * An alternate jQuery assertion library for Chai.
 */
(function () {
  /*!
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
    /*!
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
    var _equals = function (exp, act) {
      return exp === act;
    };

    var _contains = function (exp, act) {
      return act.indexOf(exp) !== -1;
    };

    var _regExpMatch = function (expRe, act) {
      return expRe.exec(act);
    };

    // ------------------------------------------------------------------------
    // Assertions
    // ------------------------------------------------------------------------

    /**
     * `.$val(string|regexp)`
     *
     * Asserts that the element value matches a string or regular expression.
     *
     *     expect($("<input value='foo' />"))
     *      .to.have.$val("foo").and
     *      .to.have.$val(/^foo/);
     *
     * @see http://api.jquery.com/val/
     *
     * @name $val
     * @param {String|RegExp} expected value
     * @param {String} message _optional_
     * @api public
     */
    var $val = function (exp, msg) {
      var $el = flag(this, "object"),
        act = $el.val(),
        name = _elName($el),
        comp = _isRegExp(exp) ? _regExpMatch : _equals;

      if (msg) {
        flag(this, "message", msg);
      }

      this.assert(
        comp(exp, act),
        "expected " + name + " to have val #{exp} but found #{act}",
        "expected " + name + " not to have val #{exp}",
        exp,
        typeof act === "undefined" ? "undefined" : act
      );
    };

    chai.Assertion.addMethod("$val", $val);

    /**
     * `.$class(string)`
     *
     * Asserts that the element has a class match.
     *
     *     expect($("<div class='foo bar' />"))
     *       .to.have.$class("foo").and
     *       .to.have.$class("bar");
     *
     * @see http://api.jquery.com/hasClass/
     *
     * @name $class
     * @param {String} expected class name
     * @param {String} message _optional_
     * @api public
     */
    var $class = function (exp, msg) {
      var $el = flag(this, "object"),
        act = $el.attr("class") || "",
        name = _elName($el);

      // TODO abstract message and rest of stuff here!!!
      if (msg) {
        flag(this, "message", msg);
      }

      this.assert(
        $el.hasClass(exp),
        "expected " + name + " to have class #{exp} but found #{act}",
        "expected " + name + " not to have class #{exp}",
        exp,
        act
      );
    };

    chai.Assertion.addMethod("$class", $class);

    /**
     * `.$html(string)`
     *
     * Asserts that the target has exactly the given HTML, or
     * asserts the target contains a subset of the HTML when using the
     * `include` or `contain` modifiers.
     *
     *     expect($("<div><span>foo</span></div>"))
     *       .to.have.$html("<span>foo</span>").and
     *       .to.contain.$html("foo");
     *
     * @see http://api.jquery.com/html/
     *
     * @name $class
     * @param {String} expected class name
     * @param {String} message _optional_
     * @api public
     */
    var $html = function (exp, msg) {
      var $el = flag(this, "object"),
        act = $el.html() || "",
        name = _elName($el),
        contains = flag(this, "contains"),
        comp = contains ? _contains : _equals;

      // TODO abstract message and rest of stuff here!!!
      if (msg) {
        flag(this, "message", msg);
      }

      this.assert(
        comp(exp, act),
        "expected " + name + " to have html #{exp} but found #{act}",
        "expected " + name + " not to have html #{exp}",
        exp,
        act
      );
    };

    chai.Assertion.addMethod("$html", $html);

  }

  /*!
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