/*eslint prefer-template: 0*/
import gulp from 'gulp';

import config from '../config';
const KarmaServer = require('karma').Server;

config.setEnvTest();

function karmaExited(exitCode) {
  console.log('Karma has exited with ' + exitCode);
  process.exit(exitCode);
}

gulp.task('test:runonce', () => {
  const srv = new KarmaServer({
    configFile: config.root('config', 'karma.conf.js'),
    singleRun: true,
    autoWatch: false,
  }, karmaExited);
  srv.start();
});

gulp.task('test:watch', () => {
  const srv = new KarmaServer({
    configFile: config.root('config', 'karma.conf.js'),
    singleRun: false,
    autoWatch: true,
  }, karmaExited);
  srv.start();
});

gulp.task('test:debug', () => {
  const srv = new KarmaServer({
    configFile: config.root('config', 'karma.conf.js'),
    singleRun: false,
    autoWatch: true,
    browsers: ['Chrome'],
  }, karmaExited);
  srv.start();
});

gulp.task('test', ['test:watch']);
