var gulp = require("gulp"),
    notify = require("gulp-notify"),
    useref = require("gulp-useref"),
    karma = require("gulp-karma"),
    jshint = require("gulp-jshint"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cssMin = require("gulp-minify-css"),
    uglify = require("gulp-uglify"),
    rimraf = require("gulp-rimraf"),
    filter = require("gulp-filter"),
    strip = require("gulp-strip-line"),
    plumber = require("gulp-plumber"),
    htmlmin = require("gulp-htmlmin");

gulp.task("clean", function() {
  return gulp.src(["dist/", "coverage/", "client/css/"], { read: false })
    .pipe(rimraf());
});

gulp.task("karma", function() {
  return gulp.src([
      "client/bower_components/angular/angular.js",
      "client/bower_components/angular-socket.io-mock/angular-socket.io-mock.js",
      "client/bower_components/angular-animate/angular-animate.js",
      "client/bower_components/angular-mocks/angular-mocks.js",
      "client/js/**/*.js",
      "client/js/app.js",
      "test/**/*.test.js"
    ])
    .pipe(plumber({ 
      errorHandler: notify.onError("<%= error.message %>")
    }))
    .pipe(karma({
      configFile: "karma.conf.js"
    }));
});

gulp.task("sass", function() {
  return gulp.src("client/scss/app.scss")
    .pipe(sass({
      includePaths: ["client/bower_components/foundation/scss"]
    }))
    .pipe(gulp.dest("client/css/"));
});

gulp.task("jshint", function() {
  return gulp.src(["client/js/**", "!client/js/highlight.pack.js"])
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(notify({
      title: function(file) {
        if(!file.jshint || file.jshint.success) {
          return false;
        }

        return "JSHint: " + file.relative + " (" + file.jshint.results.length + " errors)\n";
      },
      message: function(file) {
        if(!file.jshint || file.jshint.success) {
          return false;
        }

        var errors = file.jshint.results.map(function (data) {
          if (data.error) {
            return data.error.line + ":" + data.error.character + " | " + data.error.reason;
          }
        }).join("\n");

        return errors;
      }
    }));
});

gulp.task("useref", ["sass"], function() {
  var js = filter(["js/main.js"]), css = filter(["css/app.css"]), vendors = filter(["js/vendors.js", "js/angular.all.js"]), html = filter(["index.html"]);

  return gulp.src("client/index.html")
    .pipe(useref.assets())
    .pipe(js)
      .pipe(strip(["<STRIP>"]))
      .pipe(uglify())
    .pipe(js.restore())
    .pipe(vendors)
      .pipe(uglify())
    .pipe(vendors.restore())
    .pipe(css)
      .pipe(autoprefixer())
      .pipe(cssMin())
    .pipe(css.restore())
    .pipe(useref.restore())
    .pipe(useref())
    .pipe(html)
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
    .pipe(html.restore())
    .pipe(gulp.dest("dist"));
});

gulp.task("test", ["karma", "jshint"]);

gulp.task("build", ["test", "useref"]);