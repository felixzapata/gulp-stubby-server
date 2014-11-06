'use strict';

var pluginPath = '../index';
var plugin = require(pluginPath);
var gulp = require('gulp');
var request = require('supertest');

gulp.task('stubby', function() {
    var options = {
        stubs: 8000,
        tls: 8443,
        admin: 8001
    };
    return gulp.src('test/fixtures/*.{json,yaml,js}')
        .pipe(stubby(options));
});

exports.stubby = {
    'Test Places endpoint': function(test) {
        test.expect(1);
        request('http://localhost:8000')
            .get('/path/to/thing?a=anything&b=more')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return test.done(err);
                }
                test.deepEqual(res.body, require(__dirname + '/features/response.json'));
                test.done();
            });
    },
    'Test Users endpoint': function(test) {
        test.expect(1);
        request('http://localhost:8000')
            .post('/path/to/users')
            .set('Content-Type', 'application/json')
            .send('test body data')
            .expect('Content-Type', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return test.done(err);
                }
                test.deepEqual(res.body, {
                    status: 'ok'
                });
                test.done();
            });
    },
    'Test Localities endpoint': function(test) {
        test.expect(1);
        request('http://localhost:8000')
            .post('/localities/istambul?exclamation=post requests can have query strings!')
            .set('Content-Type', 'application/xml')
            .send('<!xml blah=\"blah blah blah\"> <envelope>\n   <unaryTag/>\n</envelope>\n')
            .expect(200)
            .expect('Content-Type', 'application/xml')
            .expect('X-API', '1.0')
            .end(function(err, res) {
                if (err) {
                    return test.done(err);
                }
                test.equal(res.text, '<!xml blah="blah blah blah"> <responseXML>\n   <content></content>\n</responseXML>');
                test.done();
            });
    },
    'Test Towns endpoint': function(test) {
        test.expect(1);
        request('http://localhost:8000')
            .get('/towns')
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect('Access-Control-Allow-Origin', '*')
            .end(function(err, res) {
                if (err) {
                    return test.done(err);
                }
                test.deepEqual(res.body, require(__dirname + '/features/towns.json'));
                test.done();
            });
    }
};
