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

    before(function () {
      this.$base = $("#fixtures");
    });

    afterEach(function () {
      this.$base.empty();
    });

    describe("setup", function () {
      it("patches native chai", function () {
        expect(chai).to.be.ok;
      });
    });

    describe("test meta", function () {
      describe("name", function () {
        it("shows 'Object' with no element name", function () {
          expect(function () {
            expect($("<div />")).to.have.$val("a");
          }).to.throw("expected [object Object] to have val 'a' but found ''");
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

      it("works with basic val", function () {
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

      it("works with single element class", function () {
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

      it("works with multiple element classes", function () {
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

  });
});
