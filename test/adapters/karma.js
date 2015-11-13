/**
 * Karma Setup
 * -----------
 * Duplicate what's normally in "test.html"
 */
/* globals $:false, chai:false */
// Chai
window.expect = chai.expect;

// Add test fixture.
$("<div />")
  .attr("id", "fixtures")
  .css({
    position: "absolute",
    bottom: "0"
  })
  .prependTo($("body"));
