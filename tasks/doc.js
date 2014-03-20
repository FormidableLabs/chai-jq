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
  var jsSrcs = {
    // Internal buffer
    _buffer: [],

    // DATA: Buffer incoming `src` JS files.
    buffer: function (file) {
      if (file.isBuffer()) {
        jsSrcs._buffer.push(file.contents.toString("utf8"));
      } else if (file.isStream()) {
        return this.emit("error",
          new PluginError(PLUGIN_NAME, "Streams are not supported!"));
      }
    },

    // END: Convert to Markdown format and pass on to destination stream.
    convertToDocs: function () {
      if (jsSrcs._buffer.length === 0) {
        return this.emit("end");
      }

      var data = dox.parseComments(jsSrcs._buffer.toString(), { raw: true });
      var mdApi = _generateMdApi(data);

      // TODO: Switch to a streams-friendly version.
      // For the life of me, I cannot figure out how to inject the README as
      // a separate stream into the mix here...
      var src = fs.readFileSync(opts.src).toString("utf8");
      var re = new RegExp(opts.startMarker + "(\n|.)*" + opts.endMarker, "m");
      var updated = src.replace(re, [
        opts.startMarker,
        "\n",
        mdApi,
        opts.endMarker
      ].join(""));

      this.emit("data", new gutil.File({
        path: opts.src + ".tmp",
        contents: new Buffer(updated)
      }));

      this.emit("end");
    }
  };

  return es.through(jsSrcs.buffer, jsSrcs.convertToDocs);

  // //var src = fs.createReadStream(opts.src).toString("utf8");

  // var LookForIncludes = through2(function () {
  //   // is this the insert point?
  //   // IF YES. then push onto new stream.  this.push(MY_MD_DATA_TO_INSERT)
  //   // RYAN: Is that equivalent to this.emit("data", MY_MD_DATA_TO_INSERT).

  // })

  // fs.createReadStream(opts.src)
  //   .pipe(lines)
  //   .pipe(LookForIncludes())


  // return es.through(function () {}, function () {
  //   this.emit("data", new gutil.File({
  //     path: opts.src + ".tmp",
  //     contents: fs.createReadStream(opts.src)
  //   }));
  //   this.emit("end");
  // });
};

module.exports = gulpDoximator;
