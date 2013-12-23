var _ = require("grunt").util._,
  dox = require("dox");

// ----------------------------------------------------------------------------
// Section
// ----------------------------------------------------------------------------
/**
 * A section / function of documentation.
 *
 * @param {Object} obj Objectified underlying data.
 */
var Section = function (data) {
  this.data = data
};

Section.prototype.tmpl = {
  toc: _.template("* [<%= heading %>](#<%= id %>)\n"),
  section: _.template("### <%= summary %>\n\n<%= body %>\n")
};

Section.prototype.isPublic = function () {
  var data = this.data;
  return !data.isPrivate && !data.ignore && _.any(data.tags, function (t) {
    return t.type === "api" && t.visibility === "public";
  });
};

Section.prototype.heading = function () {
  return this.data.description.summary;
};

Section.prototype.headingId = function () {
  return this.data.description.summary.toLowerCase().replace(/[^\w]+/g, "-");
};

Section.prototype.renderToc = function () {
  return this.tmpl.toc({
    heading: this.heading(),
    id: this.headingId()
  });
};

Section.prototype.renderSection = function () {
  return this.tmpl.section(this.data.description);
};

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Generate Markdown API snippets from dox object.
var _genApi = function (obj) {
  var toc = [];

  // Finesse comment markdown data.
  // Also, statefully create TOC.
  var sections = _.chain(obj)
    .map(function (data) { return new Section(data); })
    .filter(function (s) { return s.isPublic(); })
    .map(function (s) {
      toc.push(s.renderToc());  // Add to TOC.
      return s.renderSection(); // Render section.
    })
    .value()
    .join("");

  return "\n" + toc.join("") + "\n" + sections;
};

// ----------------------------------------------------------------------------
// Task
// ----------------------------------------------------------------------------
module.exports = function (grunt) {

  // Build.
  grunt.registerMultiTask("doc", "Inject API MD into README", function () {
    // Merge options.
    var options = this.options({
      input: "index.js",
      output: "README.md",
      startMarker: null,
      endMarker: null
    });

    var readme = grunt.file.read(options.output),
      buf = grunt.file.read("chai-jq.js"),
      data = dox.parseComments(buf, { raw: true }),
      start = options.startMarker,
      end = options.endMarker,
      re = new RegExp(start + "(\n|.)*" + end, "m"),
      md = _genApi(data),
      updated = readme.replace(re, start + "\n" + md + end);

    console.log("TODO HERE", md);
    return;

    grunt.file.write(options.output, updated);
  });
};
