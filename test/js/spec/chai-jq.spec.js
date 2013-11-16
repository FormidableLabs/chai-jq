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
          }).to.throw("expected [object Object] to have val 'a' but got ''");
        });

        it("works with element id", function () {
          expect(function () {
            expect($("<div id=\"foo\" />")).to.have.$val("a");
          }).to.throw("expected '#foo' to have val 'a' but got ''");
        });

        it("works with element classes", function () {
          expect(function () {
            expect($("<div class=\"foo\" />")).to.have.$val("a");
          }).to.throw("expected '.foo' to have val 'a' but got ''");

          expect(function () {
            expect($("<div class=\"foo bar\" />")).to.have.$val("a");
          }).to.throw("expected '.foo.bar' to have val 'a' but got ''");
        });

        it("works with mixed id's and classes", function () {
          expect(function () {
            expect($("<div id=\"foo\" class=\"a b c\" />")).to.have.$val("a");
          }).to.throw("expected '#foo.a.b.c' to have val 'a' but got ''");

          expect(function () {
            expect($("<div class=\"foo bar\" />")).to.have.$val("a");
          }).to.throw("expected '.foo.bar' to have val 'a' but got ''");
        });
      });
    });

    describe("$val", function () {
      beforeEach(function () {
        this.$fixture = $("<input id=\"test\" />").appendTo(this.$base);
      });

      it("works with no val", function () {
        var self = this;

        expect(this.$fixture)
          .to.have.$val("").and
          .to.not.have.$val("bar");

        expect(function () {
          expect(self.$fixture).to.have.$val("foo");
        }).to.throw("expected '#test' to have val 'foo' but got ''");
      });

      it("works with basic val", function () {
        var self = this;

        this.$fixture.val("MY_VALUE");

        expect(this.$fixture)
          .to.have.$val("MY_VALUE").and
          .to.not.have.$val("bar");

        expect(function () {
          expect(self.$fixture).to.have.$val("a");
        }).to.throw("expected '#test' to have val 'a' but got 'MY_VALUE'");
      });

      it("matches regexes with basic val", function () {
        var self = this;

        this.$fixture.val("RE_VAL");

        expect(this.$fixture)
          .to.have.$val(/RE_VAL/).and
          .to.have.$val(/re_val/i).and
          .to.have.$val(/.*/).and
          .to.have.$val(/./).and
          .to.have.$val(/^R/).and
          .to.have.$val(/VAL$/);

        expect(this.$fixture)
          .not
            .to.have.$val("bar").and
            .to.have.$val(/re_val/).and
            .to.have.$val(/$E/).and
            .to.have.$val(/A^/);

        expect(function () {
          expect(self.$fixture).to.have.$val("a");
        }).to.throw("expected '#test' to have val 'a' but got 'RE_VAL'");
      });
    });

  });
});
