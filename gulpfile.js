/*
 * gulp-stubby
 * https://github.com/felixzapata/gulp-stubby
 *
 * Copyright (c) 2014 Felix Zapata
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stubby = require('./index'),
    clean = require('gulp-clean'),
    nodeunit = require('gulp-nodeunit');


gulp.task('jshint', function() {
    var options = {
        jshintrc: '.jshintrc'
    };
    return gulp.src([
            'gulpfile.js',
            'tasks/*.js',
            '<%= nodeunit.tests %>'
        ])
        .pipe(jshint(options));
});

gulp.task('stubby', function() {
    var options = {
        stubs: 8000,
        tls: 8443,
        admin: 8001
    };
    return gulp.src('test/fixtures/*.{json,yaml,js}')
        .pipe(stubby(options));
});

gulp.task('nodeunit', function() {
    gulp.src('test/test.js').pipe(nodeunit());
});

gulp.task('clean', function() {
    return gulp.src('tmp', {
        read: false
    }).pipe(clean());
});

gulp.task('test', ['clean', 'stubby', 'nodeunit']);

gulp.task('default', ['jshint', 'test']);
