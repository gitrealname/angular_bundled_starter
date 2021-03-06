/*eslint global-require: 0*/
/*eslint max-len: 0*/

/*
* See: https://www.npmjs.com/package/gulp-help
* See: https://www.npmjs.com/package/run-sequence
* See: https://webpack.github.io/docs/usage-with-gulp.html
*/
const gulp = require('gulp-help')(require('gulp'));
import gutil from 'gulp-util';
import colorsSupported from 'supports-color';
import webpack from 'webpack';
import del from 'del';
import replace from 'gulp-replace';
import runSequence from 'run-sequence';

import config from '../config';
import webpackBuilder from '../webpack.builder.js';

function webpackStats(logMode, callback) {
  return (err, stats) => {
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
    if (callback) {
      callback();
    }
  };
}

function webpackRun(logMode, cb) {
  const wpConfig = webpackBuilder.buildConfig();

  //force source maps to be inlined with the source files,
  // so they can be picked up by sourcemap processor
  //If we don't, webpack ExtractTextPlugin
  //will mess-up all file references in the map for Css files
  //NOTE: commented out as even inline maps get corrupted
  // sourcemap:fix logic has been improved to deal with the situation
  //wpConfig.devtool = '#inline-source-map';

  //config.debugInspectAndExit(wpConfig);

  //'build' task always builds all bundles.
  //so that 'vendor' and 'common' get all dependencies.
  //to prevent webpack builder confusion, we disable --name
  if (config.getProcessingFlag('name') !== undefined) {
    config.error('\'--name\' option must not be specified for \'build\' task. ');
  }
  webpack(wpConfig, webpackStats(logMode, cb));
}

gulp.task('build:clean', () => {
  return del(config.root(config.data.dest.prod));
});

gulp.task('build:compile:debug', (cb) => {
  config.setEnvProdDebug();
  webpackRun(2, cb);
});

gulp.task('build:compile:release', (cb) => {
  config.setEnvProdRelease();
  webpackRun(2, cb);
});

gulp.task('build:sourcemap:fix', 'fixes source maps', () => {
  const sourceRootRx = new RegExp('("sourceRoot"\\s*:\\s*")([^"]*")', 'i');
  const relativeSrcPath = config.pathDiffToRelativePath(config.rootSrc(), 'config.data.dest.prod');

  const task = gulp.src([config.root(config.data.dest.prod) + '/**/*.map'])

  //set srouceRoot
  .pipe(replace(sourceRootRx, '$1' + relativeSrcPath + '"'))

  .pipe(gulp.dest(config.data.dest.prod, {
    overwrite: true,
  }));

  return task;
});

gulp.task('build:release', 'Build deployment package.', (cb) => {
  runSequence('build:clean', 'test:runonce', 'build:compile:release', 'build:sourcemap:fix', cb);
});

gulp.task('build:debug', 'Build debug(non-minified) deployment package.', (cb) => {
  runSequence('build:clean', 'test:runonce', 'build:compile:debug', 'build:sourcemap:fix', cb);
});

gulp.task('build', 'Default build action => Release', ['build:release']);
