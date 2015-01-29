'use strict';

var gulp = require('gulp'),
  fs = require('fs'),
  spawn = require('child_process').spawn,
  gutil = require('gulp-util'),
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

gulp.task('build', ['clean', 'build-javascript', 'build-node']);

gulp.task('build-javascript', ['clean'], function() {
    return gulp.src(['src/pact.js', 'src/interaction.js', 'src/mockService.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-checkstyle-file-reporter')))
        .pipe($.concat('pact-consumer-js-dsl.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe($.size());
});

gulp.task('build-node', ['clean', 'build-javascript'], function() {
    return gulp.src(['node.prefix', 'dist/js/pact-consumer-js-dsl.js', 'node.suffix'])
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-checkstyle-file-reporter')))
        .pipe($.concat('pact-consumer-js-dsl.js'))
        .pipe(gulp.dest('dist/node'))
        .pipe($.size());
});

gulp.task('default', ['build', 'run-tests']);

gulp.task('run-tests', ['build'], function() {
  var karmaConf = process.argv[3] ? process.argv[3] : 'karma';

  fs.mkdirSync('tmp');
  fs.mkdirSync('tmp/pacts');
  fs.mkdirSync('log');

  // Start pact-mock-service, listen for errors/ouputs
  var child = spawn('pact-mock-service', ['-p', '1234', '-l', 'tmp/pact.log', '--pact-dir', './tmp/pacts']);

    var out = function (data) {
        gutil.log('pact-mock-service output: \n'+data);
    };

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', out);
    child.stderr.on('data', out);

    child.on('close', function(code) {
        gutil.log("Done with exit code", code);
        if(code !== 0) {
            gutil.log(gutil.colors.red('An error occured with pact-mock-service'));
            gutil.beep();
        }
    });

  karma.start({
    configFile: __dirname + '/spec/' + karmaConf + '.conf.js',
    singleRun: true
  }, function(code) {
    process.kill(child.pid, 'SIGKILL');
    process.exit(code);
  });

});
