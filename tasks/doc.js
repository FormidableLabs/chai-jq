var fs = require("fs"),
  _ = require("lodash"),
  dox = require("dox"),
  es = require("event-stream"),
  gutil = require("gulp-util"),
  PluginError = gutil.PluginError,
  PLUGIN_NAME = "gulp-doximator";

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
    "  <% } else if (t.type === 'returns') { %>",
    "    * **_<%= t.type %>_** <%= t.string %>\n",
    "  <% } %>",
    "<% }); %>\n",
    "<%= description.full %>\n",
    "<% _.each(tags, function (t) { %>",
    "  <% if (t.type === 'see') { %>",
    "    See: [<%= t.url %>](<%= t.url %>)\n\n",
    "  <% } %>",
    "<% }); %>"
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
var _generateMdApi = function (obj) {
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
var gulpDoximator = function (opts) {
  // Set up options.
  opts = _.extend({
    startMarker: null,
    endMarker: null
  }, opts);

  // Validate.
  if (!opts.src || !opts.startMarker || !opts.endMarker) {
    throw new PluginError(PLUGIN_NAME, "Source and markers required");
  }

  // --------------------------------------------------------------------------
  // Stream: JS Sources
  // --------------------------------------------------------------------------
  var convert = {
    // Internal buffer
    _buffer: [],

    // DATA: Buffer incoming `src` JS files.
    buffer: function (file) {
      if (file.isBuffer()) {
        convert._buffer.push(file.contents.toString("utf8"));
      } else if (file.isStream()) {
        return this.emit("error",
          new PluginError(PLUGIN_NAME, "Streams are not supported!"));
      }
    },

    // END: Convert to Markdown format and pass on to destination stream.
    toDocs: function () {
      var data = dox.parseComments(convert._buffer.toString(), { raw: true });
      var mdApi = _generateMdApi(data);

      this.emit("data", new gutil.File({
        path: opts.src,
        contents: convert.insertTextStream(mdApi)
      }));

      this.emit("end");
    },

    // Create stream for destination and insert text appropriately.
    insertTextStream: function (text) {
      var inApiSection = false;

      return fs.createReadStream(opts.src)
        .pipe(es.split("\n"))
        .pipe(es.through(function (line) {
          // Hit the start marker.
          if (line === opts.startMarker) {
            // Emit our line (it **is** included).
            this.emit("data", line);

            // Emit our the processed API data.
            this.emit("data", text);

            // Mark that we are **within** API section.
            inApiSection = true;
          }

          // End marker.
          if (line === opts.endMarker) {
            // Mark that we have **exited** API section.
            inApiSection = false;
          }

          // Re-emit lines only if we are not within API section.
          if (!inApiSection) {
            this.emit("data", line);
          }
        }))
        .pipe(es.join("\n"))
        .pipe(es.wait());
    }
  };

  return es.through(convert.buffer, convert.toDocs);
};

module.exports = gulpDoximator;
