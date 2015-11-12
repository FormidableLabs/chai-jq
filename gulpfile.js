"use strict";

/**
 * Gulp file.
 */
var gulp = require("gulp");
var jade = require("gulp-jade");
var mdox = require("gulp-mdox");

// ----------------------------------------------------------------------------
// Docs
// ----------------------------------------------------------------------------
gulp.task("docs:api", function () {
  gulp
    .src("chai-jq.js")
    .pipe(mdox({
      src: "README.md",
      name: "README.md",
      start: "## Plugin API",
      end: "## Contributions"
    }))
    .pipe(gulp.dest("./"));
});

gulp.task("templates", function () {
  gulp
    .src("_templates/**/*.jade")
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest("./"));
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("build", ["docs:api", "templates"]);
gulp.task("default", ["build"]);
