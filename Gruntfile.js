/* global module:false */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
    },

    mocha_phantomjs: {
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
              "bower_components/chai/chai.js"
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

  // Default task
  grunt.registerTask( "default", [ "jshint", "mocha_phantomjs" ] );
};
