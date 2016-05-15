/*eslint global-require: 0*/

import gulp from 'gulp';
import gutil from 'gulp-util';
import colorsSupported from 'supports-color';
import webpack from 'webpack';

import config from '../config';
import webpackBuilder from '../webpack.builder.js';

function webpackRun(wpConfig, cb, logMode) {
  //config.debugInspectAndExit(wpConfig);

  webpack(wpConfig, (err, stats) => {
    //2 - enforce log, 1 - only on error, 0 - no log
    if (logMode === 2 || (err && logMode === 1)) {
      gutil.log('[webpack]', stats.toString({
        colors: colorsSupported,
        chunks: true,
        errorDetails: true,
      }));
    }
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    cb(err);
  });
}

gulp.task('build:debug', (cb) => {
  config.setEnvProdDebug();
  const wp = webpackBuilder.buildConfig();
  webpackRun(wp, cb, 2);
});

gulp.task('build:release', (cb) => {
  config.setEnvProdRelease();
  const wp = webpackBuilder.buildConfig();
  webpackRun(wp, cb, 2);
});

gulp.task('build:dual:release', (cb) => {
  config.setEnvProdRelease();
  const wp = webpackBuilder.buildConfig();
  webpackRun(wp, cb, 1);
});

gulp.task('build:dual:debug', ['build:dual:release'], (cb) => {
  config.setEnvProdDebug();
  const wp = webpackBuilder.buildConfig();
  webpackRun(wp, cb, 2);
});

gulp.task('build', ['test:runonce', 'build:dual:release', 'build:dual:debug']);
