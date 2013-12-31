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
  this.data = data;
};

Section.prototype.tmpl = {
  toc:     _.template("* [`<%= heading %>`](#<%= id %>)\n"),
  heading: _.template("<%= name %><%= params %>"),
  section: _.template(_.map([
    "### `<%= heading %>`\n",
    "<% _.each(tags, function (t) { %>",
    "  <% if (t.type === 'param') { %>",
    "    * **<%= t.name %>** (`<%= t.types.join('|') %>`) ",
    "    <%= t.description %>\n",
    "  <% } %>",
    "<% }); %>\n\n",
    "<%= description.full %>\n",
    "<% _.each(tags, function (t) { %>",
    "  <% if (t.type === 'see') { %>",
    "    See: [<%= t.url %>](<%= t.url %>)\n\n",
    "  <% } %>",
    "<% }); %>",
    "\n"
  ], function (s) { return s.replace(/^\s+/, ""); }).join(""))
};

Section.prototype.isPublic = function () {
  var data = this.data;
  return !data.isPrivate && !data.ignore && _.any(data.tags, function (t) {
    return t.type === "api" && t.visibility === "public";
  });
};

Section.prototype.heading = function () {
  var params = _.chain(this.data.tags)
    .filter(function (t) { return t.type === "param"; })
    .map(function (t) {
      var isOpt = t.description.indexOf("_optional_") !== -1;
      return isOpt ? "[" + t.name + "]" : t.name;
    })
    .value()
    .join(", ");

  return this.tmpl.heading({
    name: this.data.ctx.name,
    params: params ? "(" + params + ")" : null
  });
};

// Memoize.
Section.prototype.heading = _.memoize(
  Section.prototype.heading, function () { return this.data.ctx.name; });

Section.prototype.headingId = function () {
  return this.heading().toLowerCase().replace(/[^\w]+/g, "-");
};

Section.prototype.renderToc = function () {
  return this.tmpl.toc({
    heading: this.heading(),
    id: this.headingId()
  });
};

Section.prototype.renderSection = function () {
  return this.tmpl.section(_.extend({
    heading: this.heading()
  }, this.data));
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

    // Validate.
    if (!options.startMarker || !options.endMarker) {
      console.log(options);
      throw new Error("Markers required");
    }

    var readme = grunt.file.read(options.output),
      buf = grunt.file.read(options.input),
      data = dox.parseComments(buf, { raw: true }),
      start = options.startMarker,
      end = options.endMarker,
      re = new RegExp(start + "(\n|.)*" + end, "m"),
      md = _genApi(data),
      updated = readme.replace(re, start + "\n" + md + end);

    grunt.file.write(options.output, updated);
  });
};
