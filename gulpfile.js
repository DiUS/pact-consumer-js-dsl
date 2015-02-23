'use strict';

var gulp = require('gulp'),
	runSequence = require('run-sequence'),
    fs = require('fs-extra'),
    q = require('q'),
    request = require('request'),
    spawn = require('child_process').spawn,
    gutil = require('gulp-util'),
    umd = require('gulp-umd'),
    path = require('path'),
    karma = require('karma').server,
    $ = require('gulp-load-plugins')();

// FILES
var srcFiles = ['src/pact.js', 'src/interaction.js', 'src/http.js', 'src/mockServiceRequests.js', 'src/mockService.js'];
var specFiles = ['spec/**/*spec.js'];
var distFiles = ['dist/pact-consumer-js-dsl.js'];
var karmaConfig = 'spec/karma.conf.js';
var nodeConfig = 'spec/node.conf.js';

var cleanDirectories = function (directories) {
    directories.forEach(function (directory) {
        fs.removeSync(directory);
        fs.mkdirsSync(directory);
    });
};

var waitForServerToStart = function () {
    var deferred = q.defer();
    var attempts = 0;

    var checkIfServerHasStarted = function () {
        attempts += 1;
        request('http://localhost:1234', function (error) {
            if (attempts > 500) {
	            var e = new Error('Timed out waiting for the pact-mock-service to start');
	            console.error(e);
                deferred.reject(e);
            } else if (error) {
                setTimeout(checkIfServerHasStarted, 1000);
            } else {
                deferred.resolve();
            }
        });
    };

    setTimeout(checkIfServerHasStarted, 1000);

    return deferred.promise;
};

var withServer = function (action) {
    var deferred = q.defer();

    cleanDirectories(['tmp/pacts', 'log']);
    var child = spawn('bundle', ['exec', 'pact-mock-service', '-p', '1234', '-l', 'tmp/pact.log', '--pact-dir', './tmp/pacts']);
    child.on('error', function (error) {
        console.log('pact-mock-service:', error.toString());
    });

    waitForServerToStart().then(function () {
        var actionDone = function (error) {
            child.kill();

            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve();
            }
        };

        var actionStream = action();
        actionStream.on('end', actionDone);
        actionStream.on('error', actionDone);
        actionStream.resume();
    }, deferred.reject);

    return deferred.promise;
};

gulp.task('clear', function (done) {
    return $.cache.clearAll(done);
});

gulp.task('clean', ['clear'], function () {
    return gulp.src(['dist'], {
        read: false
    }).pipe($.clean());
});

gulp.task('build', ['clean'], function () {
    return gulp.src(srcFiles)
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.concat('pact-consumer-js-dsl.js'))
        .pipe(umd({
            exports: function (file) {
                return 'Pact';
            },
            namespace: function (file) {
                return 'Pact';
            },
            template: path.join(__dirname, 'umd-template.js')
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.size())
});

gulp.task('default', ['build', 'run-tests']);

gulp.task('run-browser-tests', ['build'], function () {
    return withServer(function () {
        return gulp.src(distFiles.concat(specFiles))
            .pipe($.karma({configFile: karmaConfig}));
    });
});

gulp.task('run-unit-tests', ['build'], function () {
    return withServer(function () {
	    return gulp.src(distFiles.concat(['spec/unit/**/*spec.js']))
		    .pipe($.karma({configFile: 'spec/karma-unit.conf.js'}));
    });
});

gulp.task('run-node-tests', ['build'], function () {
    return withServer(function () {
        return gulp.src(distFiles.concat(nodeConfig, specFiles))
            .pipe($.jasmine());
    });
});

gulp.task('run-tests', function(callback){
	runSequence('run-unit-tests', 'run-browser-tests', 'run-node-tests', callback);
});

gulp.task('watch', ['clean'], function () {
    return withServer(function () {
        return gulp.src(srcFiles.concat(specFiles))
            .pipe($.karma({configFile: karmaConfig, action: 'watch'}));
    });
});

