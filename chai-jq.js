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
     * ```js
     * expect($("<input value='foo' />"))
     *   .to.have.$val("foo").and
     *   .to.have.$val(/^foo/);
     * ```
     *
     * See: [http://api.jquery.com/val/]()
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
     * ```js
     * expect($("<div class='foo bar' />"))
     *   .to.have.$class("foo").and
     *   .to.have.$class("bar");
     * ```
     *
     * See: [http://api.jquery.com/hasClass/]()
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

    /*!
     * Abstract base for a "containable" method call.
     *
     * @param {String} jQuery method name.
     * @param {String} hasArg takes argument for method
     */
    var _containMethod = function (jqMeth, hasArg) {
      hasArg = !!hasArg;

      return _jqAssert(function () {
        var exp = arguments[hasArg ? 1 : 0],
          arg = hasArg ? arguments[0] : undefined,
          act = (hasArg ? this._$el[jqMeth](arg) : this._$el[jqMeth]()) || "",
          meth = hasArg ? jqMeth + "('" + arg + "')" : jqMeth,
          contains = flag(this, "contains"),
          have = contains ? "contain" : "have",
          comp = contains ? _contains : _equals;

        this.assert(
          comp(exp, act),
          "expected " + this._name + " to " + have + " " + meth +
            " #{exp} but found #{act}",
          "expected " + this._name + " not to " + have + " " + meth +
            " #{exp}",
          exp,
          act
        );
      });
    };

    /**
     * `.$attr(string)`
     *
     * Asserts that the target has exactly the given attribute, or
     * asserts the target contains a subset of the attribute when using the
     * `include` or `contain` modifiers.
     *
     * ```js
     * expect($("<div id="hi" foo="bar time">/div>"))
     *   .to.have.$attr("id", "hi").and
     *   .to.contain.$attr("foo", "bar");
     * ```
     *
     * See: [http://api.jquery.com/attr/]()
     *
     * @name $attr
     * @param {String} expected attribute content
     * @param {String} message _optional_
     * @api public
     */
    var $attr = _containMethod("attr", true);

    chai.Assertion.addMethod("$attr", $attr);

    /**
     * `.$html(string)`
     *
     * Asserts that the target has exactly the given HTML, or
     * asserts the target contains a subset of the HTML when using the
     * `include` or `contain` modifiers.
     *
     * ```js
     * expect($("<div><span>foo</span></div>"))
     *   .to.have.$html("<span>foo</span>").and
     *   .to.contain.$html("foo");
     * ```
     *
     * See: [http://api.jquery.com/html/]()
     *
     * @name $html
     * @param {String} expected HTML content
     * @param {String} message _optional_
     * @api public
     */
    var $html = _containMethod("html");

    chai.Assertion.addMethod("$html", $html);

    /**
     * `.$text(string)`
     *
     * Asserts that the target has exactly the given text, or
     * asserts the target contains a subset of the text when using the
     * `include` or `contain` modifiers.
     *
     * ```js
     * expect($("<div><span>foo</span> bar</div>"))
     *   .to.have.$text("foo bar").and
     *   .to.contain.$text("foo");
     * ```
     *
     * See: [http://api.jquery.com/text/]()
     *
     * @name $text
     * @param {String} expected text content
     * @param {String} message _optional_
     * @api public
     */
    var $text = _containMethod("text");

    chai.Assertion.addMethod("$text", $text);
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