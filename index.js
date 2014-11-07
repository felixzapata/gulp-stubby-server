/*
 * gult-stubby
 * https://github.com/felixzapata/gulp-stubby
 *
 * Copyright (c) 2014 Félix Zapata
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    es = require('event-stream'),
    gutil = require('gulp-util'),
    Stubby = require('stubby').Stubby,
    path = require('path'),
    PLUGIN_NAME = 'gulp-stubby';


function stubbyPlugin(customOptions) {


    // Merge task-specific and/or target-specific options with these defaults.
    var defaultOptions = {
        callback: null, // takes one parameter: the error message (if there is one), undefined otherwise
        stubs: 8882, // port number to run the stubs portal
        admin: 8889, // port number to run the admin portal
        tls: 7443, // port number to run the stubs portal over https
        data: null, // JavaScript Object/Array containing endpoint data
        location: 'localhost', // address/hostname at which to run stubby
        key: null, // keyfile contents (in PEM format)
        cert: null, // certificate file contents (in PEM format)
        pfx: null, // pfx file contents (mutually exclusive with key/cert options)
        watch: null, // filename to monitor and load as stubby's data when changes occur
        mute: true, // defaults to true. Pass in false to have console output (if available)
        relativeFilesPath: false, // if enabled, obtains the data mock file path relatively to the config file directory
        persistent: false // Run the task in a persistent server mode. Other tasks not will run until the Stubby server stops
    }, options = customOptions ? _.assign(defaultOptions, customOptions) : defaultOptions,
        child,
        stream,
        files = [];


    function startStubby() {

        var stubbyServer = new Stubby();

        stubbyServer.start(_.omit(options, 'callback', 'relativeFilesPath', 'persistent'), function (error) {
            if (error) {
                gutil.log('Stubby error: "' + error);
                done(1);
                return;
            }

            if (_.isFunction(options.callback)) {
                options.callback(stubbyServer, options);
            }

            gutil.log('Stubby HTTP server listening on port ' + options.stubs);
            gutil.log('Stubby HTTPS server listening on port ' + options.tls);
            gutil.log('Admin server listening on port ' + options.admin);

            if (!options.persistent) {
                 done();
            }

        });
    }

    function done(code) {
        // Stop the server if it's running
        if (child) {
            child.kill();
        }
        // End the stream if it exists
        if (stream) {
            if (code) {
                stream.emit('error', new gutil.PluginError(PLUGIN_NAME, 'stubby exited with code ' + code));
            } else {
                stream.emit('end');
            }
        }
    }


    function queueFile(file) {
        if (file) {
            files.push(file.path);
        } else {
            stream.emit('error', new Error('Got undefined file'));
        }
    }

    function endStream() {

        if (files.length) {
            options.files = files;
        }

        startStubby();
    }

    stream = es.through(queueFile, endStream);
    return stream;
}


module.exports = stubbyPlugin;
