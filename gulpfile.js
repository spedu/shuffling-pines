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

var buildDir = './build';

gulp.task('jshint', function() {
  return gulp.src(javascripts)
          .pipe(jshint())
          .pipe(jshint.reporter(stylish));
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

// TODO separate vendor and source builds...
gulp.task('buildJS', function() {
  return gulp.src([
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            javascripts
          ]).pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(gulp.dest(buildDir));
});

gulp.task('buildCSS', function() {
  return gulp.src([
            'bower_components/bootstrap/dist/css/bootstrap.css',
            stylesheets
          ]).pipe(concat('styles.css'))
            .pipe(minifyCss())
            .pipe(gulp.dest(buildDir))
});

gulp.task('moveHTML', function() {
  return gulp.src(html).pipe(gulp.dest(buildDir));
});

gulp.task('build', ['clean', 'buildCSS', 'buildJS', 'moveHTML']);

gulp.task('watch', function() {
  gulp.watch([javascripts, tests, stylesheets, html], ['test', 'build']);
});

gulp.task('connect', function() {
  connect.server({
    root: buildDir,
    livereload: true
  });
});

gulp.task('default', ['clean', 'build', 'watch', 'connect']);
