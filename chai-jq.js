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
    /*!
     * Wrap assert function and add properties.
     */
    var _jqAssert = function (fn) {
      return function (exp, msg) {
        // Set properties.
        this._$el = flag(this, "object");
        this._name = _elName(this._$el);

        // Flag message.
        if (msg) {
          flag(this, "message", msg);
        }

        // Invoke assertion function.
        fn.apply(this, arguments);
      };
    };

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
    var $val = _jqAssert(function (exp) {
      var act = this._$el.val(),
        comp = _isRegExp(exp) ? _regExpMatch : _equals;

      this.assert(
        comp(exp, act),
        "expected " + this._name + " to have val #{exp} but found #{act}",
        "expected " + this._name + " not to have val #{exp}",
        exp,
        typeof act === "undefined" ? "undefined" : act
      );
    });

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
    var $class = _jqAssert(function (exp) {
      var act = this._$el.attr("class") || "";

      this.assert(
        this._$el.hasClass(exp),
        "expected " + this._name + " to have class #{exp} but found #{act}",
        "expected " + this._name + " not to have class #{exp}",
        exp,
        act
      );
    });

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
     * @name $html
     * @param {String} expected HTML content
     * @param {String} message _optional_
     * @api public
     */
    var $html = _jqAssert(function (exp) {
      var act = this._$el.html() || "",
        contains = flag(this, "contains"),
        have = contains ? "contain" : "have",
        comp = contains ? _contains : _equals;

      this.assert(
        comp(exp, act),
        "expected " + this._name + " to " + have +
          " html #{exp} but found #{act}",
        "expected " + this._name + " not to " + have + " html #{exp}",
        exp,
        act
      );
    });

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