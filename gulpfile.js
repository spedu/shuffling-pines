var gulp = require('gulp');

var Server = require('karma').Server;

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var connect = require('gulp-connect');
var del = require('del');

var appDir = './src';

var html = appDir + '/**/*.html';
var javascripts = appDir + '/js/**/*.js';
var stylesheets = appDir + '/css/**/*.css';
var tests = appDir + '/tests/**/*.js';

var vendorDir = './bower_components';

var vendorJavascripts = vendorDir + '/**/*.min.js';
var vendorStylesheets = vendorDir + '/**/*.css';

var buildDir = './build';

gulp.task('jshint', function() {
  return gulp.src([javascripts, tests])
          .pipe(jshint())
          .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('karma', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js', 
    singleRun: true
  }, done).start();
});

gulp.task('test', ['jshint', 'karma']);

gulp.task('clean', function() {
  del(buildDir + '/**/*');
});

gulp.task('buildVendorJS', function() {
  return gulp.src([
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/**/*.min.js',
            javascripts
          ]).pipe(concat('vendor.js'))
            .pipe(uglify())
            .pipe(gulp.dest(buildDir))
            .pipe(connect.reload());
});

gulp.task('buildAppJS', function() {
  return gulp.src(javascripts)
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(gulp.dest(buildDir))
            .pipe(connect.reload());
});

gulp.task('buildJS', ['buildVendorJS', 'buildAppJS']);

gulp.task('buildCSS', function() {
  return gulp.src([
            'bower_components/bootstrap/dist/css/bootstrap.css',
            stylesheets
          ]).pipe(concat('styles.css'))
            .pipe(minifyCss())
            .pipe(gulp.dest(buildDir))
            .pipe(connect.reload());
});

gulp.task('moveHTML', function() {
  return gulp.src(html)
            .pipe(gulp.dest(buildDir))
            .pipe(connect.reload());
});

gulp.task('build', ['clean', 'buildCSS', 'buildJS', 'moveHTML']);

gulp.task('watch', function() {
  gulp.watch([javascripts, tests], ['test', 'buildAppJS']);
  gulp.watch([vendorJavascripts], ['test', 'buildVendorJS']);
  gulp.watch([vendorStylesheets, stylesheets], ['buildCSS']);
  gulp.watch([html], ['moveHTML']);
});

gulp.task('connect', function() {
  connect.server({
    root: buildDir,
    livereload: true
  });
});

gulp.task('default', ['clean', 'build', 'test', 'watch', 'connect']);
