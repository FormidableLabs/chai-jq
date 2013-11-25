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
    // Assertions (Internal)
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

    /*!
     * Base for the boolean is("selector") method call.
     *
     *
     * See: [http://api.jquery.com/is/]
     *
     * @param {String} selector jQuery selector to match against
     */
    var _isMethod = function (jqSelector) {
      // Make selector human readable.
      var selectorDesc = jqSelector.replace(/:/g, "");

      // Return decorated assert.
      return _jqAssert(function () {
        this.assert(
          this._$el.is(jqSelector),
          "expected " + this._name + " to be " + selectorDesc,
          "expected " + this._name + " to not be " + selectorDesc
        );
      });
    };

    /*!
     * Abstract base for a "containable" method call.
     *
     * @param {String} jQuery           method name.
     * @param {Object} opts             options
     * @param {String} opts.hasArg      takes argument for method
     * @param {String} opts.hasContains is "contains" applicable
     */
    var _containMethod = function (jqMeth, opts) {
      // Unpack options.
      opts || (opts = {});
      opts.hasArg = !!opts.hasArg;
      opts.hasContains = !!opts.hasContains;
      opts.defaultAct = undefined;

      // Return decorated assert.
      return _jqAssert(function () {
        // Arguments.
        var exp = arguments[opts.hasArg ? 1 : 0],
          arg = opts.hasArg ? arguments[0] : undefined,

          // Method.
          act = (opts.hasArg ? this._$el[jqMeth](arg) : this._$el[jqMeth]()),
          meth = opts.hasArg ? jqMeth + "('" + arg + "')" : jqMeth,

          // Assertion type.
          contains = opts.hasContains && flag(this, "contains"),
          have = contains ? "contain" : "have",
          comp = contains ? _contains : _equals;

        if (typeof act === "undefined") {
          act = opts.defaultAct;
        }

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

    // ------------------------------------------------------------------------
    // API
    // ------------------------------------------------------------------------

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

    /**
     * `.$visible`
     *
     * Asserts that the element is visible.
     *
     * ```js
     * expect($("<div>&nbsp;</div>"))
     *   .to.be.$visible;
     * ```
     *
     * See: [http://api.jquery.com/visible-selector/]()
     *
     * @api public
     */
    var $visible = _isMethod(":visible");

    chai.Assertion.addProperty("$visible", $visible);

    /**
     * `.$hidden`
     *
     * Asserts that the element is hidden.
     *
     * ```js
     * expect($("<div style=\"display: none\" />"))
     *   .to.be.$hidden;
     * ```
     *
     * See: [http://api.jquery.com/hidden-selector/]()
     *
     * @api public
     */
    var $hidden = _isMethod(":hidden");

    chai.Assertion.addProperty("$hidden", $hidden);

    /**
     * `.$attr(name, string)`
     *
     * Asserts that the target has exactly the given named attribute, or
     * asserts the target contains a subset of the attribute when using the
     * `include` or `contain` modifiers.
     *
     * ```js
     * expect($("<div id=\"hi\" foo=\"bar time\" />"))
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
    var $attr = _containMethod("attr", {
      hasArg: true,
      hasContains: true
    });

    chai.Assertion.addMethod("$attr", $attr);

    /**
     * `.$prop(name, value)`
     *
     * Asserts that the target has exactly the given named property.
     *
     * ```js
     * expect($("<input type=\"checkbox\" checked=\"checked\" />"))
     *   .to.have.$prop("checked", true).and
     *   .to.have.$prop("type", "checkbox");
     * ```
     *
     * See: [http://api.jquery.com/prop/]()
     *
     * @name $prop
     * @param {Object} expected property value
     * @param {String} message _optional_
     * @api public
     */
    var $prop = _containMethod("prop", {
      hasArg: true
    });

    chai.Assertion.addMethod("$prop", $prop);

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
    var $html = _containMethod("html", {
      hasContains: true
    });

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
    var $text = _containMethod("text", {
      hasContains: true
    });

    chai.Assertion.addMethod("$text", $text);

    /**
     * `.$css(name, string)`
     *
     * Asserts that the target has exactly the given CSS property.
     *
     * ```js
     * expect($("<div style=\"width: 50px; border: 1px dotted black;\" />"))
     *   .to.have.$css("width", "50px").and
     *   .to.have.$css("border-top-style", "dotted");
     * ```
     *
     * See: [http://api.jquery.com/css/]()
     *
     * @name $css
     * @param {String} expected CSS property content
     * @param {String} message _optional_
     * @api public
     */
    var $css = _containMethod("css", {
      hasArg: true
    });

    chai.Assertion.addMethod("$css", $css);
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
