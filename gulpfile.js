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
    stubby = require('./index.js'),
    nodeunit = require('gulp-nodeunit');


gulp.task('jshint', function() {
    gulp.src([
            '!gulpfile.js',
            '!test/*.js',
            'index.js'
        ])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter());
});

gulp.task('stubby', function() {
    var options = {
        stubs: 8000,
        tls: 8443,
        admin: 8001
    };
    gulp.src('test/fixtures/*.{json,yaml,js}')
        .pipe(stubby(options));
});

gulp.task('nodeunit', function() {
    gulp.src('test/test.js').pipe(nodeunit());
});


gulp.task('test', ['stubby', 'nodeunit']);

gulp.task('default', ['jshint', 'test']);
