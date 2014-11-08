# Gulp Stubby

[![Build Status](https://travis-ci.org/felixzapata/gulp-stubby.png)](https://travis-ci.org/felixzapata/gulp-stubby)

> A Gulp plugin for setting up a [Stubby](https://github.com/mrak/stubby4node) mock server based on YAML/JSON/JS configuration files.

Inspired by [Grunt Stubby](https://github.com/h2non/grunt-stubby).

## Getting Started

```shell
npm install gulp-stubby --save-dev
```

## The "stubby" task

### Usage Examples

#### Default Options

```js
gulp.task('stubby', function() {
    gulp.src('mocks/*.{json,yaml,js}')
        .pipe(stubby());
});
```

#### Custom Options

```js
gulp.task('stubby', function() {
    var options: {
        callback: function (server, options) {
          server.get(1, function (err, endpoint) {
            if (!err)
             console.log(endpoint);
          });
        },
        stubs: 8000,
        tls: 8443,
        admin: 8010
      },
    gulp.src('mocks/*.{json,yaml,js}')
        .pipe(stubby(options));
});
```

### Options

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

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.

Add unit tests for any new or changed functionality.
Lint and test your code using [Gulp](http://gulpjs.com/).

### Testing

Clone the repository
```shell
$ git clone https://github.com/felixzapata/gulp-stubby.git && cd gulp-stubby
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

## License

Under [MIT](https://github.com/felixzapata/gulp-stubby/) license
