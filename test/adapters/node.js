/**
 * Mocha bridge and test runner.
 */
// Imports
var plugin  = require("../../chai-jq");
var jsdom   = require("jsdom");
var chai    = require("chai");
var $       = require("jquery");

// Set up JsDom.
var document = jsdom.jsdom("<html><head></head><body>" +
  "<div id=\"fixtures\" style=\"position: absolute; bottom: 0;\"></div>" +
  "</body></html>");
var window = document.createWindow();

// Global setup.
global.expect = chai.expect;

// Inject plugin.
chai.use(plugin);

// Add tests.
require("../js/spec/chai-jq.spec")($.create(window));
