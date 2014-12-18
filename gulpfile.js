'use strict';

var gulp = require('gulp'),
  fs = require('fs'),
  spawn = require('child_process').spawn,
  karma = require('karma').server,
  $ = require('gulp-load-plugins')();

gulp.task('clear', function(done) {
  return $.cache.clearAll(done);
});

gulp.task('clean', ['clear'], function() {
  return gulp.src(['tmp', 'dist', 'log'], {
    read: false
  }).pipe($.clean());
});

gulp.task('build', ['clean'], function() {
  return gulp.src(['src/pact.js', 'src/interaction.js', 'src/mockService.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-checkstyle-file-reporter')))
    .pipe($.concat('pact-js-dsl.js'))
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('default', ['build']);

gulp.task('run-tests', ['build'], function() {
  var karmaConf = process.argv[3] ? process.argv[3] : 'karma';

  fs.mkdirSync('tmp');
  fs.mkdirSync('tmp/pacts');
  fs.mkdirSync('log');

  var child = spawn('bundle', ['exec', 'pact-mock-service', '-p', '1234', '-l', 'tmp/pact.log']);

  karma.start({
    configFile: __dirname + '/spec/' + karmaConf + '.conf.js',
    singleRun: true
  }, function(code) {
    process.kill(child.pid, 'SIGKILL');
    process.exit(code);
  });

});
