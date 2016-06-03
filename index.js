/*
 * gult-stubby-server
 * https://github.com/felixzapata/gulp-stubby-server
 *
 * Copyright (c) 2014 Félix Zapata
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    glob = require('glob-all'),
    gutil = require('gulp-util'),
    Stubby = require('stubby').Stubby,
    path = require('path'),
    YAML = require('js-yaml'),
    PLUGIN_NAME = 'gulp-stubby-server';


// defines the absolute path for external static request/response
// files that will be processed internally by Stubby

function setPathStaticFiles(array, filepath) {
    filepath = path.dirname(filepath);



    function setAbsoluteFilePath(file) {
        return filepath + '/' + file;
    }

    array = array.map(function(object) {
        if (_.isObject(object.request) && object.request.file) {
            if (!isPathAbsolute(object.request.file)) {
                object.request.file = setAbsoluteFilePath(object.request.file);
            }
        }
        if (_.isObject(object.response)) {
            // support collections for responses
            if (_.isArray(object.response)) {
                object.response = object.response.map(function(response) {
                    if (response.file && !isPathAbsolute(response.file)) {
                        response.file = setAbsoluteFilePath(response.file);
                    }
                    return response;
                });
            } else {
                if (object.response.file && !isPathAbsolute(object.response.file)) {
                    object.response.file = setAbsoluteFilePath(object.response.file);
                }
            }
        }

        return object;
    });

    return array;
}

function isPathAbsolute() {
    var filepath = path.join.apply(path, arguments);
    return path.resolve(filepath) === filepath.replace(/[\/\\]+$/, '');
}

function readYAML(filepath, options) {
    var src = fs.readFileSync(filepath, options),
        result;
    if (!options.mute) {
        gutil.log(gutil.colors.yellow('Parsing ' + filepath + '...'));
    }
    try {
        result = YAML.load(src);
        return result;
    } catch (e) {
        throw new gutil.PluginError(PLUGIN_NAME, 'Unable to parse "' + filepath + '" file (' + e.problem + ').', e);
    }
}

function readJSON(filepath, options) {
    var src = fs.readFileSync(filepath, options),
        result;
    if (!options.mute) {
        gutil.log(gutil.colors.yellow('Parsing ' + filepath + '...'));
    }
    try {
        result = JSON.parse(src);
        return result;
    } catch (e) {
        throw new gutil.PluginError(PLUGIN_NAME, 'Unable to parse "' + filepath + '" file (' + e.message + ').', e);
    }
}


function getAbsolutePath(filepath) {
    if (!isPathAbsolute(filepath)) {
        filepath = process.cwd() + '/' + filepath;
    }
    return filepath;
}

function stubbyPlugin(customOptions, cb) {


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
        },
        options = customOptions ? _.assign(defaultOptions, customOptions) : defaultOptions,
        stubbyServer = new Stubby(),
        data, files;


    if (options.files) {
        files = glob.sync(options.files);
        // Iterate over all specified file groups.
        data = _.union.apply(_, files.filter(function(filepath) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!fs.existsSync(filepath)) {
                gutil.log(gutil.colors.red('Source file "' + filepath + '" not found.'));
                return false;
            }
            return true;
        }).map(function(filepath) {
            var data;
            filepath = getAbsolutePath(filepath);
            // Read file source.
            if (/\.ya?ml$/g.test(filepath)) {
                data = readYAML(filepath, options);
            } else if (/\.js$/g.test(filepath)) {
                try {
                    data = require(filepath);
                } catch (e) {
                    gutil.log(gutil.colors.red('Error while parsing JS file "' + filepath + '"', 1));
                }
            } else {
                data = readJSON(filepath, options);
            }

            if (!_.isArray(data)) {
                data = [data];
            }
            return options.relativeFilesPath ? setPathStaticFiles(data, filepath) : data;
        }));

        if (_.isObject(options.data)) {
            if (_.isArray(options.data)) {
                options.data = _.union(options.data, data);
            } else {
                options.data = data.push(options.data);
            }
        } else {
            options.data = data;
        }

        stubbyServer.start(_.omit(options, 'callback', 'relativeFilesPath', 'persistent'), function(error) {
            if (error) {
                gutil.log(gutil.colors.red('Stubby error: "' + error));
                return cb();
            }
            if (_.isFunction(options.callback)) {
                options.callback(stubbyServer, options);
            }

            gutil.log(gutil.colors.green('Stubby HTTP server listening on port ' + options.stubs));
            gutil.log(gutil.colors.green('Stubby HTTPS server listening on port ' + options.tls));
            gutil.log(gutil.colors.green('Admin server listening on port ' + options.admin));

            if (!options.persistent) {
                cb();
            }

        });
    }

    return {
        stop: function() {
            stubbyServer.stop();
            gutil.log(gutil.colors.green('Stubby server stopped'));
        }
    };

}

module.exports = stubbyPlugin;
