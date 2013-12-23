var _ = require("grunt").util._,
  dox = require("dox");

// Marked: Process heading text into ID.
var _headingId = function (text) {
  return text.toLowerCase().replace(/[^\w]+/g, "-");
};

// Generate Markdown API snippets from dox object.
var _genApi = function (obj) {
  var toc = [],
    tocTmpl = _.template("* [<%= heading %>](#<%= id %>)\n"),
    sectionTmpl = _.template("### <%= summary %>\n\n<%= body %>\n");

  // Finesse comment markdown data.
  // Also, statefully create TOC.
  var sections = _.chain(obj)
    .filter(function (c) {
      return !c.isPrivate && !c.ignore && _.any(c.tags, function (t) {
        return t.type === "api" && t.visibility === "public";
      });
    })
    .map(function (c) {
      // Add to TOC.
      toc.push(tocTmpl({
        heading: c.description.summary,
        id: _headingId(c.description.summary)
      }));

      return sectionTmpl(c.description);
    })
    .value()
    .join("");

  return "\n" + toc.join("") + "\n" + sections;
};

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

    // console.log("TODO HERE", md);
    // return;

    grunt.file.write(options.output, updated);
  });
};
