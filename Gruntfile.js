/* global module:false */
var _ = require("grunt").util._,
  dox = require("dox");

// Add in local node_modules bin for testem.
process.env.PATH = [process.env.PATH || "", "./node_modules/.bin"].join(":");

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
  // Strip comments from JsHint JSON files (naive).
  var _jshintCfg = function (name) {
    if (!grunt.file.exists(name)) { return "{}"; }

    var raw = grunt.file.read(name);
    return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    jshint: {
      options: _jshintCfg(".jshintrc-frontend.json"),
      "frontend-frontend": {
        files: {
          src:  [
            "test/js/spec/**/*.js",
            "*.js",
            "!Gruntfile.js"
          ]
        }
      },
      "frontend-backend": {
        options: _jshintCfg(".jshintrc-backend.json"),
        files: {
          src:  [
            "Gruntfile.js"
          ]
        }
      }
    },

    "mocha_phantomjs": {
      test: [
        "test/test.html",
      ],
      amd: [
        "test/test-amd.html"
      ]
    },

    testem: {
      // Everything!
      all: {
        src: [
          "test/test.html"
        ],
        dest: ".testem-dev.tap"
      },
      // Dev.
      dev: {
        options: {
          "launch_in_ci": [
            "PhantomJS"
          ]
        },
        src: [
          "test/test.html"
        ],
        dest: ".testem-dev.tap"
      },
      // Travis. (Only FF and PhantomJS right now).
      ci: {
        options: {
          "launch_in_ci": [
            "Firefox",
            "PhantomJS"
          ]
        },
        src: [
          "test/test.html"
        ],
        dest: ".testem-ci.tap"
      }
    },

    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: {
          "index.html":         ["_templates/index.jade"],
          "test/test.html":     ["_templates/test/test.jade"],
          "test/test-amd.html": ["_templates/test/test-amd.jade"]
        }
      }
    },

    copy: {
      test: {
        files: [
          {
            dest: "test/js/lib",
            expand: true,
            flatten: true,
            src: [
              "bower_components/mocha/mocha.js",
              "bower_components/mocha/mocha.css",
              "bower_components/chai/chai.js",
              "bower_components/jquery/jquery.js",
              "bower_components/requirejs/require.js",
              "bower_components/pure/pure-min.css"
            ]
          },
          {
            dest: "test/js/lib/sinon.js",
            src: "bower_components/sinon/index.js"
          }
        ]
      }
    },

    watch: {
      "build-api": {
        files: [
          "chai-jq.js"
        ],
        tasks: [
          "build:api"
        ],
        options: {
          spawn: false,
          atBegin: true
        }
      },
      jade: {
        files: [
          "_templates/**/*.jade",
          "*.md",
          "chai-jq.js"
        ],
        tasks: [
          "jade"
        ],
        options: {
          spawn: false,
          atBegin: true
        }
      }
    }

  });

  // Dependencies
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha-phantomjs");
  grunt.loadNpmTasks("grunt-testem");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jade");

  // Build.
  grunt.registerTask("build:api", "Insert API into README", function () {
    var readme = grunt.file.read("README.md"),
      buf = grunt.file.read("chai-jq.js"),
      data = dox.parseComments(buf, { raw: true }),
      start = "## Plugin API",
      end = "## Contributions",
      re = new RegExp(start + "(\n|.)*" + end, "m"),
      md = _genApi(data),
      updated = readme.replace(re, start + "\n" + md + end);

    grunt.file.write("README.md", updated);
  });
  grunt.registerTask("build",     ["build:api", "jade"]);

  // Tasks.
  grunt.registerTask("check",     ["jshint", "mocha_phantomjs"]);
  grunt.registerTask("check:all", ["check", "testem:all"]);
  grunt.registerTask("default",   ["copy", "check", "build"]);
};
