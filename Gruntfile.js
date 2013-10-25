/* global module:false */
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
      all: ["test/test.html"]
    },

    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: {
          "index.html":     ["_templates/index.jade"],
          "test/test.html": ["_templates/test/test.jade"]
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
              "bower_components/jquery/jquery.js"
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
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jade");

  // Tasks.
  grunt.registerTask("check", ["jshint", "mocha_phantomjs"]);
  grunt.registerTask("default", ["copy", "check"]);
};
