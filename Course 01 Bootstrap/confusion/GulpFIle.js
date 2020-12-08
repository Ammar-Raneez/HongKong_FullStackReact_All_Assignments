'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

gulp.task('sass', function () {
    return gulp.src('./css/*.scss')     //src function takes file globs and creates a stream of objects that represents the files
    .pipe(sass().on('error', sass.logError))    //pip allows the stream to be piped thru a function
    .pipe(gulp.dest('./css'));      //dest specifies the destination of the changed files
});

gulp.task('sass:watch', function () {
    gulp.watch('./css/*.scss', ['sass']);
});

gulp.task('browser-sync', function () {
    var files = [
    './*.html',
    './css/*.css',
    './img/*.{png,jpg,gif}',
    './js/*.js'
    ];

    browserSync.init(files, {
    server: {
        baseDir: "./"
    }
    });
});

// Default task
gulp.task('default', ['browser-sync'], function() {
    gulp.start('sass:watch');       //make sure browser sync runs before sas.watch
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('copyfonts', function() {
    gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

// Images
gulp.task('imagemin', function() {
    return gulp.src('img/*.{png,jpg,gif}')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('usemin', function() {
    return gulp.src('./*.html')
    //flatmap takes html files and process em in parallel
    .pipe(flatmap(function(stream, file){
        return stream
            .pipe(usemin({
                css: [ rev() ],
                html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
                js: [ uglify(), rev() ],
                inlinejs: [ uglify() ],
                inlinecss: [ cleanCss(), 'concat' ]
            }))
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build',['clean'], function() {
    gulp.start('copyfonts','imagemin','usemin');
});
//gulp code, for doing the same