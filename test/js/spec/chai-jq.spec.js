// Boilerplate and test setup.
(function () {
  /*global module:true */
  var root = this,
    isNode = typeof require === "function" &&
             typeof exports === "object" &&
             typeof module  === "object";

  // Make AMD/Non-AMD compatible (boilerplate).
  if (typeof define !== "function") { /*global define:true */
    define = function (deps, callback) {
      // Export if node, else actually run.
      if (isNode) { module.exports = callback; }
      else        { callback(root.$); }
    };
  }

  // Patch Mocha.
  // Skip node for certain tests.
  it.skipNode = function () {
    return (isNode ? it.skip : it).apply(this, arguments);
  };
}());

define(["jquery"], function ($) {
  describe("chai-jq", function () {
    before(function () {
      this.$base = $("#fixtures");
    });

    afterEach(function () {
      this.$base.empty();
    });

    describe("test meta", function () {
      describe("name", function () {
        it("shows 'Object' with no element name", function () {
          expect(function () {
            expect($("<div />")).to.have.$val("a");
          }).to.throw("expected [object Object] to have val 'a' " +
                      "but found ''");
        });

        it("works with element id", function () {
          expect(function () {
            expect($("<div id=\"foo\" />")).to.have.$val("a");
          }).to.throw("expected '#foo' to have val 'a' but found ''");
        });

        it("works with element classes", function () {
          expect(function () {
            expect($("<div class=\"foo\" />")).to.have.$val("a");
          }).to.throw("expected '.foo' to have val 'a' but found ''");

          expect(function () {
            expect($("<div class=\"foo bar\" />")).to.have.$val("a");
          }).to.throw("expected '.foo.bar' to have val 'a' but found ''");
        });

        it("works with mixed id's and classes", function () {
          expect(function () {
            expect($("<div id=\"foo\" class=\"a b c\" />")).to.have.$val("a");
          }).to.throw("expected '#foo.a.b.c' to have val 'a' but found ''");

          expect(function () {
            expect($("<div class=\"foo bar\" />")).to.have.$val("a");
          }).to.throw("expected '.foo.bar' to have val 'a' but found ''");
        });
      });
    });

    describe("$val", function () {
      beforeEach(function () {
        this.$fixture = $("<input id=\"test\" />").appendTo(this.$base);
      });

      it("works with no val", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.have.$val("").and
          .to.not.have.$val("bar");

        expect(function () {
          expect($fixture).to.have.$val("foo");
        }).to.throw("expected '#test' to have val 'foo' but found ''");
      });

      it("works with no matched element", function () {
        // NOTE: On ie9/win7 in Sauce Labs, the failure message is an
        // `Unspecified error.` if an empty selector is not attached /
        // searched from the DOM. So `var $fixture = $("#NO_MATCH");` would
        // cause this. However, `.find` from something attached to DOM works
        // like normal, hence the selector below.
        var $fixture = this.$fixture.find("#NO_MATCH");

        expect($fixture)
          .to.have.$val(undefined).and
          .to.not.have.$val("bar");

        expect(function () {
          expect($fixture).to.have.$val("foo");
        }).to.throw(
          "expected <EMPTY OBJECT> to have val 'foo' but found 'undefined'");
      });

      it("can override error messages", function () {
        var $fixture = this.$fixture;

        expect(function () {
          expect($fixture).to.have.$val("foo", "MY ERROR MSG");
        }).to.throw("MY ERROR MSG");
      });

      it("matches basic vals", function () {
        var $fixture = this.$fixture;

        $fixture.val("MY_VALUE");

        expect($fixture)
          .to.have.$val("MY_VALUE").and
          .to.not.have.$val("bar");

        expect(function () {
          expect($fixture).to.have.$val("a");
        }).to.throw("expected '#test' to have val 'a' but found 'MY_VALUE'");

        expect($("<input value='foo' />"))
          .to.have.$val("foo").and
          .to.have.$val(/^foo/);
      });

      it("matches regexes with basic val", function () {
        var $fixture = this.$fixture;

        $fixture.val("RE_VAL");

        expect($fixture)
          .to.have.$val(/RE_VAL/).and
          .to.have.$val(/re_val/i).and
          .to.have.$val(/.*/).and
          .to.have.$val(/./).and
          .to.have.$val(/^R/).and
          .to.have.$val(/VAL$/);

        expect($fixture)
          .not
            .to.have.$val("bar").and
            .to.have.$val(/re_val/).and
            .to.have.$val(/$E/).and
            .to.have.$val(/A^/);

        expect(function () {
          expect($fixture).to.have.$val("a");
        }).to.throw("expected '#test' to have val 'a' but found 'RE_VAL'");
      });
    });

    describe("$class", function () {
      beforeEach(function () {
        this.$fixture = $("<div id=\"test\" />").appendTo(this.$base);
      });

      it("works with no class", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.have.$class("").and
          .to.not.have.$class("bar");

        expect(function () {
          expect($fixture).to.have.$class("foo");
        }).to.throw("expected '#test' to have class 'foo' but found ''");
      });

      it("matches single classes in elements", function () {
        var $fixture = this.$fixture;

        $fixture.prop("class", "MY_CLASS");

        expect($fixture)
          .to.have.$class("MY_CLASS").and
          .to.not.have.$val("bar");

        expect(function () {
          expect($fixture).to.have.$class("a");
        }).to.throw("expected '#test.MY_CLASS' to have class 'a' " +
                    "but found 'MY_CLASS'");
      });

      it("matches multiple classes in elements", function () {
        var $fixture = this.$fixture;

        $fixture.prop("class", "CLS1 CLS2");

        expect($fixture)
          .to.have.$class("CLS1").and
          .to.have.$class("CLS2").and
          .to.not.have.$val("CLS3");

        expect(function () {
          expect($fixture).to.have.$class("a");
        }).to.throw("expected '#test.CLS1.CLS2' to have class 'a' " +
                    "but found 'CLS1 CLS2'");

        expect($("<div class='foo bar' />"))
          .to.have.$class("foo").and
          .to.have.$class("bar");
      });
    });

    describe("$visible, $hidden", function () {
      beforeEach(function () {
        this.$fixture = $("<div id=\"test\" >&nbsp;</div>")
          .appendTo(this.$base);
      });

      it("verifies element visibility", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.be.$visible.and
          .to.not.be.$hidden;

        $fixture.hide();

        expect($fixture)
          .to.be.$hidden.and
          .to.not.be.$visible;

        expect(function () {
          expect($fixture).to.be.$visible;
        }).to.throw("expected '#test' to be visible");

        $fixture.show();

        expect(function () {
          expect($fixture).to.be.$hidden;
        }).to.throw("expected '#test' to be hidden");
      });

      // JsDom doesn't work for zero sizes.
      it.skipNode("verifies element visibility on zero-sizes", function () {
        expect($("<div style=\"width: 0; height: 0;\" />"))
          .to.be.$hidden.and
          .to.not.be.$visible;
      });

      // JsDom doesn't work for parent visibility.
      it.skipNode("verifies visibility if parent is hidden", function () {
        var $fixture = this.$fixture;

        $fixture.wrap("<div />");

        expect($fixture)
          .to.be.$visible.and
          .to.not.be.$hidden;

        $fixture.parent().hide();

        expect($fixture)
          .to.be.$hidden.and
          .to.not.be.$visible;
      });
    });

    describe("$attr", function () {
      beforeEach(function () {
        this.$fixture = $("<div id=\"test\" foo=\"fun time\" />")
          .appendTo(this.$base);
      });

      it("matches attribute", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.have.$attr("id", "test").and
          .to.have.$attr("foo", "fun time").and
          .to.not
            .have.$attr("id", "te").and
            .have.$attr("foo", "time");

        expect(function () {
          expect($fixture).to.have.$attr("foo", "fun");
        }).to.throw("expected '#test' to have attr('foo') 'fun' " +
                    "but found '" + "fun time" + "'");
      });

      it("checks presence of attribute", function () {
        var $fixture = this.$fixture;

        expect($fixture).to.have.$attr("id");
        expect($fixture).to.have.$attr("foo");
        expect(this.$fixture).to.not.have.$attr("bar");

        expect(function () {
          expect($fixture).to.have.$attr("bar");
        }).to.throw("expected '#test' to have attr('bar')");

        expect(function () {
          expect($fixture).to.not.have.$attr("foo");
        }).to.throw("expected '#test' not to have attr('foo')");
      });

      it("changes context to attribute", function () {
        expect(this.$fixture).to.have.$attr("foo").and
          .to.equal("fun time").and
          .to.match(/^f/).and
          .to.not.have.length(2);
      });

      it("does not change context for negated attribute", function () {
        expect(this.$fixture).to.not
          .have.$attr("bar").and
          .have.$attr("baz").and
          .have.$attr("boy");
      });

      it("matches attribute subsets", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.contain.$attr("id", "test").and
          .to.contain.$attr("id", "te").and
          .to.contain.$attr("foo", "fun time").and
          .to.contain.$attr("foo", "fun").and
          .to.not
            .contain.$attr("id", "ate").and
            .contain.$attr("foo", "atime");

        expect(function () {
          expect($fixture).to.contain.$attr("foo", "funky");
        }).to.throw("expected '#test' to contain attr('foo') 'funky' " +
                    "but found '" + "fun time" + "'");

        expect($("<div id=\"hi\" foo=\"bar time\" />"))
          .to.have.$attr("id", "hi").and
          .to.contain.$attr("foo", "bar");
      });
    });

    describe("$data", function () {
      beforeEach(function () {
        var el = "<div id=\"test\" " +
          "data-id=\"test\" " +
          "data-options='{\"name\":\"John\"}' " +
          "data-foo=\"fun time\" />";
        this.$fixture = $(el)
          .appendTo(this.$base);
      });

      it("matches data attribute", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.have.$data("id", "test").and
          .to.have.$data("foo", "fun time").and
          .to.not
            .have.$data("id", "te").and
            .have.$data("foo", "time");

        expect($fixture)
          .to.have.$data("options").and
          .to.have.property("name", "John");

        expect(function () {
          expect($fixture).to.have.$data("foo", "fun");
        }).to.throw("expected '#test' to have data('foo') 'fun' " +
                    "but found '" + "fun time" + "'");
      });

      it("checks presence of data attribute", function () {
        var $fixture = this.$fixture;

        expect($fixture).to.have.$data("id");
        expect($fixture).to.have.$data("foo");
        expect(this.$fixture).to.not.have.$data("bar");

        expect(function () {
          expect($fixture).to.have.$data("bar");
        }).to.throw("expected '#test' to have data('bar')");

        expect(function () {
          expect($fixture).to.not.have.$data("foo");
        }).to.throw("expected '#test' not to have data('foo')");
      });

      it("changes context to data attribute", function () {
        expect(this.$fixture).to.have.$data("foo").and
          .to.equal("fun time").and
          .to.match(/^f/).and
          .to.not.have.length(2);
      });

      it("does not change context for negated data attribute", function () {
        expect(this.$fixture).to.not
          .have.$data("bar").and
          .have.$data("baz").and
          .have.$data("boy");
      });

      it("matches data attribute subsets", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.contain.$data("id", "test").and
          .to.contain.$data("id", "te").and
          .to.contain.$data("foo", "fun time").and
          .to.contain.$data("foo", "fun").and
          .to.not
            .contain.$data("id", "ate").and
            .contain.$data("foo", "atime");

        expect(function () {
          expect($fixture).to.contain.$data("foo", "funky");
        }).to.throw("expected '#test' to contain data('foo') 'funky' " +
                    "but found '" + "fun time" + "'");

        expect($("<div id=\"test\" data-id=\"hi\" data-foo=\"bar time\" />"))
          .to.have.$data("id", "hi").and
          .to.contain.$data("foo", "bar");
      });
    });

    describe("$prop", function () {
      beforeEach(function () {
        this.$fixture = $(
          "<input id=\"test\" type=\"checkbox\" checked=\"checked\" />")
            .appendTo(this.$base);
      });

      it("matches property", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.have.$prop("nothave", undefined);

        expect($fixture)
          .to.have.$prop("checked", true).and
          .to.have.$prop("type", "checkbox").and
          .to.not
            .have.$prop("checked", false).and
            .have.$prop("type", "check");

        expect(function () {
          expect($fixture).to.have.$prop("checked", false);
        }).to.throw("expected '#test' to have prop('checked') false " +
                    "but found true");

        expect($("<input type=\"checkbox\" checked=\"checked\" />"))
          .to.have.$prop("checked", true).and
          .to.have.$prop("type", "checkbox");
      });

      it("checks presence of property", function () {
        var $fixture = this.$fixture;

        expect($fixture).to.have.$prop("checked");
        expect($fixture).to.have.$prop("type");
        expect($fixture).to.not.have.$prop("bar");

        expect(function () {
          expect($fixture).to.have.$prop("bar");
        }).to.throw("expected '#test' to have prop('bar')");

        expect(function () {
          expect($fixture).to.not.have.$prop("type");
        }).to.throw("expected '#test' not to have prop('type')");
      });

      it("changes context to property", function () {
        expect(this.$fixture).to.have.$prop("type").and
          .to.equal("checkbox").and
          .to.match(/^c.*x$/).and
          .to.not.have.length(2);
      });

      it("does not change context for negated property", function () {
        expect(this.$fixture).to.not
          .have.$prop("bar").and
          .have.$prop("baz");
      });
    });

    describe("$html", function () {
      beforeEach(function () {
        this.$fixture = $("<div id=\"test\" />").appendTo(this.$base);
      });

      it("matches HTML", function () {
        var $fixture = this.$fixture,
          html = "<div><em>Hi</em>there</div>";

        $fixture.html(html);

        expect($fixture)
          .to.have.$html(html).and
          .to.not.have.$html("<em>Hi</em>");

        expect(function () {
          expect($fixture).to.have.$html("there");
        }).to.throw("expected '#test' to have html 'there' " +
                    "but found '" + $fixture.html() + "'");
      });

      it("matches HTML subsets", function () {
        var $fixture = this.$fixture,
          html = "<div><em>Hi</em>there</div>";

        $fixture.html(html);

        expect($fixture)
          .to.contain.$html(html).and
          .to.contain.$html("<em>Hi</em>").and
          .to.not
            .contain.$html("<em>Ho</em>").and
            .contain.$html("<em>Ha</em>");

        expect(function () {
          expect($fixture).to.contain.$html("hi");
        }).to.throw("expected '#test' to contain html 'hi' " +
                    "but found '" + $fixture.html() + "'");

        expect($("<div><span>foo</span></div>"))
          .to.have.$html("<span>foo</span>").and
          .to.contain.$html("foo");
      });
    });

    describe("$text", function () {
      beforeEach(function () {
        this.$fixture = $("<div id=\"test\" />").appendTo(this.$base);
      });

      it("matches text", function () {
        var $fixture = this.$fixture,
          html = "<div><em>Hi</em> there</div>";

        $fixture.html(html);

        expect($fixture)
          .to.have.$text("Hi there").and
          .to.not.have.$text("Hi");

        expect(function () {
          expect($fixture).to.have.$text("there");
        }).to.throw("expected '#test' to have text 'there' " +
                    "but found '" + $fixture.text() + "'");
      });

      it("matches text subsets", function () {
        var $fixture = this.$fixture,
          html = "<div><em>Hi</em> there</div>";

        $fixture.html(html);

        expect($fixture)
          .to.contain.$text("Hi there").and
          .to.contain.$text("Hi").and
          .to.not
            .contain.$text("Ho").and
            .contain.$text("Ha");

        expect(function () {
          expect($fixture).to.contain.$text("hi");
        }).to.throw("expected '#test' to contain text 'hi' " +
                    "but found '" + $fixture.text() + "'");

        expect($("<div><span>foo</span> bar</div>"))
          .to.have.$text("foo bar").and
          .to.contain.$text("foo");
      });
    });

    describe("$css", function () {
      beforeEach(function () {
        this.$fixture = $(
          "<div style=\"width: 50px; border: 1px dotted black;\" />"
        ).appendTo(this.$base);
      });

      it("matches explicit CSS properties", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.have.$css("width", "50px").and
          .to.not
            .have.$css("width", "100px").and
            .have.$css("height", "50px");

        expect($fixture)
          .to.contain.$css("border", "1px dotted").and
          .to.contain.$css("border", "dotted").and
          .to.not
            .contain.$css("border", "solid").and
            .contain.$css("border", "2px");

        expect($("<p style=\"float: left; display: none;\" />"))
          .to.have.$css("float", "left").and
          .to.have.$css("display", "none");
      });

      // JsDom doesn't work properly with computed properties.
      it.skipNode("matches computed CSS properties", function () {
        var $fixture = this.$fixture;

        expect($fixture)
          .to.have.$css("border-top-style", "dotted").and
          .to.not
            .have.$css("border-top-style", "solid");

        expect(function () {
          expect($fixture).to.have.$css("width", "100px");
        }).to.throw("expected [object Object] to have css('width') '100px' " +
                    "but found '50px'");
      });
    });

  });
});
