'use strict';

var gulp = require('gulp'),
  fs = require('fs-extra'),
  q = require('q'),
  request = require('request'),
  spawn = require('child_process').spawn,
  $ = require('gulp-load-plugins')();

var cleanDirectories = function(directories) {
  directories.forEach(function(directory) {
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
      if (attempts > 100) {
        deferred.reject(new Error('Timed out waiting for the pact-mock-service to start'));
      } else if (error) {
        setTimeout(checkIfServerHasStarted, 100);
      } else {
        deferred.resolve();
      }
    });
  };

  checkIfServerHasStarted();

  return deferred.promise;
};

var withServer = function(action) {
  var deferred = q.defer();

  cleanDirectories(['tmp/pacts', 'log']);
  var child = spawn('bundle', ['exec', 'pact-mock-service', '-p', '1234', '-l', 'tmp/pact.log', '--pact-dir', './tmp/pacts']);
  child.on('error', function(error) {
    console.log('pact-mock-service:', error.toString());
  });

  waitForServerToStart().then(function () {
    var actionDone = function(error) {
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
  });

  return deferred.promise;
};

var srcFiles = ['src/bootstrap.js', 'src/pact.js', 'src/interaction.js', 'src/http.js', 'src/mockServiceRequests.js', 'src/mockService.js'];
var specFiles = ['spec/**/*spec.js'];
var distFiles = ['dist/pact-consumer-js-dsl.js'];
var karmaConfig = 'spec/karma.conf.js';

gulp.task('clear', function(done) {
  return $.cache.clearAll(done);
});

gulp.task('clean', ['clear'], function() {
  return gulp.src(['dist'], {
    read: false
  }).pipe($.clean());
});

gulp.task('build', ['clean'], function() {
  return gulp.src(srcFiles)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.concat('pact-consumer-js-dsl.js'))
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('run-browser-tests', ['build'], function() {
  return withServer(function() {
    return gulp.src(distFiles.concat(specFiles))
      .pipe($.karma({configFile: karmaConfig}));
  });
});

gulp.task('run-node-tests', ['build', 'run-browser-tests'], function() {
  return withServer(function() {
    return gulp.src(distFiles.concat(specFiles))
      .pipe($.jasmine());
  });
});

gulp.task('run-tests', ['run-browser-tests', 'run-node-tests']);

gulp.task('watch', ['clean'], function() {
  return withServer(function() {
    return gulp.src(srcFiles.concat(specFiles))
      .pipe($.karma({configFile: 'spec/karma.conf.js', action: 'watch'}));
  });
});

gulp.task('default', ['build']);