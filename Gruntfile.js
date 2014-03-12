// // Add in local node_modules bin for testem.
// process.env.PATH = [process.env.PATH || "", "./node_modules/.bin"].join(":");

module.exports = function (grunt) {
  // // Strip comments from JsHint JSON files (naive).
  // var _jshintCfg = function (name) {
  //   if (!grunt.file.exists(name)) { return "{}"; }

  //   var raw = grunt.file.read(name);
  //   return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
  // };

  grunt.initConfig({
    // pkg: grunt.file.readJSON("package.json"),

    // jshint: {
    //   options: _jshintCfg(".jshintrc-frontend.json"),
    //   "frontend-frontend": {
    //     files: {
    //       src:  [
    //         "test/js/spec/**/*.js",
    //         "*.js",
    //         "!Gruntfile.js",
    //         "!gulpfile.js"
    //       ]
    //     }
    //   },
    //   "frontend-backend": {
    //     options: _jshintCfg(".jshintrc-backend.json"),
    //     files: {
    //       src:  [
    //         "*.js",
    //         "tasks/**/*.js",
    //         "test/js/test-node.js"
    //       ]
    //     }
    //   }
    // },

    // "mocha_phantomjs": {
    //   test: [
    //     "test/test.html",
    //   ],
    //   amd: [
    //     "test/test-amd.html"
    //   ]
    // },

    // testem: {
    //   // Everything!
    //   all: {
    //     src: [
    //       "test/test.html"
    //     ],
    //     dest: ".testem-dev.tap"
    //   },
    //   // Dev.
    //   dev: {
    //     options: {
    //       "launch_in_ci": [
    //         "PhantomJS"
    //       ]
    //     },
    //     src: [
    //       "test/test.html"
    //     ],
    //     dest: ".testem-dev.tap"
    //   },
    //   // Travis. (Only FF and PhantomJS right now).
    //   ci: {
    //     options: {
    //       "launch_in_ci": [
    //         "Firefox",
    //         "PhantomJS"
    //       ]
    //     },
    //     src: [
    //       "test/test.html"
    //     ],
    //     dest: ".testem-ci.tap"
    //   }
    // },

    // mochaTest: {
    //   test: {
    //     options: {
    //       reporter: "spec"
    //     },
    //     src: ["test/test-node.js"]
    //   }
    // },

    // jade: {
    //   compile: {
    //     options: {
    //       pretty: true
    //     },
    //     files: {
    //       "index.html":         ["_templates/index.jade"],
    //       "test/test.html":     ["_templates/test/test.jade"],
    //       "test/test-amd.html": ["_templates/test/test-amd.jade"]
    //     }
    //   }
    // },

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

    // doc: {
    //   api: {
    //     options: {
    //       input: "chai-jq.js",
    //       output: "README.md",
    //       startMarker: "## Plugin API",
    //       endMarker: "## Contributions"
    //     }
    //   }
    // },

    watch: {
      all: {
        files: [
          "_templates/**/*.jade",
          "*.md",
          "chai-jq.js"
        ],
        tasks: [
          "doc:api",
          "jade"
        ],
        options: {
          spawn: false,
          atBegin: true
        }
      }
    }

  });

  // Local dependencies.
  grunt.loadTasks("./tasks");

  // Dependencies
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha-phantomjs");
  grunt.loadNpmTasks("grunt-testem");
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jade");

  // Build.
  grunt.registerTask("build",     ["doc:api", "jade"]);

  // Tasks.
  grunt.registerTask("test:dev",  ["mocha_phantomjs"]);
  grunt.registerTask("test:all",  ["testem:all"]);
  grunt.registerTask("test:ci",   ["testem:ci"]);
  grunt.registerTask("test:node", ["mochaTest"]);

  grunt.registerTask("check",     ["jshint", "test:dev", "test:node"]);
  grunt.registerTask("check:ci",  ["check", "test:ci"]);
  grunt.registerTask("check:all", ["check", "test:all"]);
  grunt.registerTask("default",   ["copy", "check", "build"]);
};
