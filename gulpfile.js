/*
 * gulp-stubby-server
 * https://github.com/felixzapata/gulp-stubby-server
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
    var options = {
        jshintrc: '.jshintrc'
    };
    return gulp.src([
            'gulpfile.js',
            'index.js',
            'test/test.js'
        ])
        .pipe(jshint(options));
});

gulp.task('stubby', ['jshint'], function(cb) {
    var options = {
        stubs: 8000,
        tls: 8443,
        admin: 8001,
        persistent: false,
        files: [
            'test/fixtures/cities.yml',
            'test/fixtures/localities.yaml',
            'test/fixtures/places.json',
            'test/fixtures/towns.js',
            'test/fixtures/users.json',
            'test/fixtures/*.{json,yaml,yml,js}'
        ]
    };
    return stubby(options, cb);
});


gulp.task('nodeunit', ['stubby'], function() {
    return gulp.src('test/test.js').pipe(nodeunit()).on('end', function() {
        process.nextTick(function() {
            process.exit(0);
        });
    });
});
