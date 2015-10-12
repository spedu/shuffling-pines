var gulp = require('gulp');

var Server = require('karma').Server;

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var connect = require('gulp-connect');
var del = require('del');


