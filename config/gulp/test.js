/*eslint prefer-template: 0*/

/*
* See: https://www.npmjs.com/package/gulp-help
*/
const gulp = require('gulp-help')(require('gulp'));
import gutil from 'gulp-util';

import config from '../config';
const KarmaServer = require('karma').Server;

gulp.task('test:runonce', (cb) => {
  config.setEnvTest();
  const srv = new KarmaServer({
    configFile: config.root('config', 'karma.conf.js'),
    singleRun: true,
    autoWatch: false,
    reporters: ['mocha', 'coverage'],
  }, (err) => {
    if (err) {
      err = new gutil.PluginError('karma', err);
    }
    cb(err);
  });
  srv.start();
});

gulp.task('test:watch', (cb) => {
  config.setEnvTestWatch();
  const srv = new KarmaServer({
    configFile: config.root('config', 'karma.conf.js'),
    singleRun: false,
    autoWatch: true,
    reporters: ['dots'], //['dots', 'coverage']
  }, (err) => {
    if (err) {
      err = new gutil.PluginError('karma', err);
    }
    cb(err);
  });
  srv.start();
});

gulp.task('test:debug', (cb) => {
  config.setEnvTestWatch();
  const srv = new KarmaServer({
    configFile: config.root('config', 'karma.conf.js'),
    singleRun: false,
    autoWatch: true,
    reporters: ['dots'],
    browsers: ['Chrome'],
  }, (err) => {
    if (err) {
      err = new gutil.PluginError('karma', err);
    }
    cb(err);
  });
  srv.start();
});

gulp.task('test', ['test:watch']);
