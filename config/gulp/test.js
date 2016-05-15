/*eslint prefer-template: 0*/

/*
* See: https://www.npmjs.com/package/gulp-help
*/
const gulp = require('gulp-help')(require('gulp'));

import config from '../config';
const KarmaServer = require('karma').Server;

function karmaExited(exitCode) {
  console.log('Karma has exited with ' + exitCode);
  process.exit(exitCode);
}

gulp.task('test:runonce', () => {
  config.setEnvTest();
  const srv = new KarmaServer({
    configFile: config.root('config', 'karma.conf.js'),
    singleRun: true,
    autoWatch: false,
    reporters: ['mocha', 'coverage'],
  }, karmaExited);
  srv.start();
});

gulp.task('test:watch', () => {
  config.setEnvTestWatch();
  const srv = new KarmaServer({
    configFile: config.root('config', 'karma.conf.js'),
    singleRun: false,
    autoWatch: true,
    reporters: ['dots'], //['dots', 'coverage']
  }, karmaExited);
  srv.start();
});

gulp.task('test:debug', () => {
  config.setEnvTestWatch();
  const srv = new KarmaServer({
    configFile: config.root('config', 'karma.conf.js'),
    singleRun: false,
    autoWatch: true,
    reporters: ['dots'],
    browsers: ['Chrome'],
  }, karmaExited);
  srv.start();
});

gulp.task('test', ['test:watch']);
