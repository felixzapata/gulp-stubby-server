# Gulp Stubby Server

[![Build Status](https://travis-ci.org/felixzapata/gulp-stubby-server.png)](https://travis-ci.org/felixzapata/gulp-stubby-server)

[![Package Quality](http://npm.packagequality.com/badge/gulp-stubby-server.png)](http://packagequality.com/#?package=gulp-stubby-server)

> A Gulp plugin for setting up a [Stubby](https://github.com/mrak/stubby4node) mock server based on YAML/JSON/JS configuration files.

Inspired by [Grunt Stubby](https://github.com/h2non/grunt-stubby).

## Getting Started

```shell
npm install gulp-stubby-server --save-dev
```

## The "stubby" task

### Usage Examples

#### Default Options

```js
gulp.task('stubby', function(cb) {
    var options = {
        files: [
            'mocks/*.{json,yaml,js}'
        ]
    };
    stubby(options, cb);
});
```

#### Custom Options

```js
gulp.task('stubby', function() {
    var options = {
        callback: function (server, options) {
          server.get(1, function (err, endpoint) {
            if (!err)
             console.log(endpoint);
          });
        },
        stubs: 8000,
        tls: 8443,
        admin: 8010,
        files: [
            'mocks/foobar.json',
            'mocks/another-foobar-file.yaml',
            'mocks/foobar.yml',
            'mocks/another-foobar-file.js'
        ]
    };
    stubby(options, cb);
});
```

### Options

#### options.files
Type: `Array`
Default: null

Config files to run the server. It can accept a list of files or a glob pattern.

#### options.stubs
Type: `Number`
Default value: `8882`

Port number to run the stubs portal

#### options.tls
Type: `Number`
Default value: `7443`

Port number to run the stubs portal over https

#### options.admin
Type: `Number`
Default value: `8889`

Port number to run the admin portal

#### options.data
Type: `Array/Object`
Default value: `null`

JavaScript Object/Array containing endpoint data.
This option will be automatically filled from the JSON/YAML config files, however you can additionally add a customized data

#### options.location
Type: `String`
Default value: `localhost`

Address/hostname at which to run stubby

#### options.relativeFilesPath
Type: `Boolean`
Default value: `false`

When you use the 'file' property for the request/response config Objects, enabling this options
the data file path is relative to the the config file where it has been declared.

#### options.key
Type: `String`
Default value: `null`

Path to keyfile contents (in PEM format)

#### options.cert
Type: `String`
Default value: `null`

Certificate file path contents (in PEM format)

#### options.pfx
Type: `String`
Default value: `null`

Pfx file path contents (mutually exclusive with key/cert options)

#### options.watch
Type: `String`
Default value: `null`

Filename to monitor and load as stubby's data when changes occur

#### options.mute
Type: `Boolean`
Default value: `true`

Pass in false to have console output (if available)

#### options.callback
Type: `Function`
Default value: `null`

Callback function when the server starts successfully.
The passed arguments are:

* `server` - The Stubby server instance object
* `options` - The server config options object

#### options.persistent
Type: `Boolean`
Default value: `false`

Run the task in a persistent keep-alive server mode. Other tasks not will run until the Stubby server stops

## API

#### stop
Allows you to programmatically shutdown the stubby server.

```
stubbyServer.stop();
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.

Add unit tests for any new or changed functionality.
Lint and test your code using [Gulp](http://gulpjs.com/).

### Testing

Clone the repository
```shell
$ git clone https://github.com/felixzapata/gulp-stubby-server.git && cd gulp-stubby-server
```

Install dependencies
```shell
$ npm install
```

Run tests
```shell
$ npm test
```

## Release History
* `0.2.0` 04.06.2016
  - Fix issue [#9](https://github.com/felixzapata/gulp-stubby-server/issues/9)
  - Update Stubby package to 0.3.1
  - Update README file
  - Activate `jshint` task

* `0.1.6` 03.02.2016
  - Update glob package

* `0.1.5` 26.08.2015
  - Add YML files
  - Update package versions
  - Move gulp and gulp-util to dependencies

* `0.1.4` 16.07.2015
  - It adds a method to allows you to programmatically shutdown the stubby server.

* `0.1.3` 09.12.2014
  - Fix(package.json): glob should be a dependency instead of devDependency

* `0.1.2` 05.12.2014
  - Fix(index.js): on stubby error, calling the callback should be the last action
  - Fix(package.json): gulp-util must be as a dependency

* `0.1.1` 27.11.2014
  - Changes repository name

* `0.1.0` 27.11.2014
  - Initial release

## License

Under [MIT](https://github.com/felixzapata/gulp-stubby/) license
