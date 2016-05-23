/*eslint global-require: 0*/
/*eslint max-len: 0*/

/*
* See: https://www.npmjs.com/package/gulp-help
* See: https://github.com/floridoo/gulp-sourcemaps
* See: https://github.com/shama/webpack-stream
*/
const gulp = require('gulp-help')(require('gulp'));
import gutil from 'gulp-util';
import colorsSupported from 'supports-color';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';
import vinylNamed from 'vinyl-named';
import through2 from 'through2';

import config from '../config';
import webpackBuilder from '../webpack.builder.js';

let webpackStatsLogType = 2;

function buildWebpackEntryList(wpConfig) {
  //config.debugInspectAndExit(wpConfig.entry);

  const entryList = Object.keys(wpConfig.entry).reduce((prev, k) => {
    const v = wpConfig.entry[k][0];
    prev.push(v);
    return prev;
  }, []);
  return entryList;
}

function webpackStats(err, stats) {
  //2 - enforce log, 1 - only on error, 0 - no log
  if (webpackStatsLogType === 2 || (err && webpackStatsLogType === 1)) {
    gutil.log('[webpack]', stats.toString({
      colors: colorsSupported,
      chunks: true,
      errorDetails: true,
    }));
  }
  if (err) {
    throw new gutil.PluginError('webpack', err);
  }
}

function webpackRun(logMode) {
  webpackStatsLogType = logMode;
  const wpConfig = webpackBuilder.buildConfig();

  //config.debugInspectAndExit(wpConfig);

  //'build' task always builds all bundles.
  //so that 'vendor' and 'common' get all dependencies.
  //to prevent webpack builder confusion, we disable --name
  if (config.getProcessingFlag('name')) {
    config.error('\'--name\' option must not be specified for \'build\' task. ');
  }
  webpack(wpConfig, webpackStats);
}

gulp.task('build:debug', () => {
  config.setEnvProdDebug();
  webpackRun(2);
});

gulp.task('build:release', () => {
  config.setEnvProdRelease();
  webpackRun(2);
});

gulp.task('build:dual:release', () => {
  config.setEnvProdRelease();
  webpackRun(1);
});

gulp.task('build:dual:debug', ['build:dual:release'], () => {
  config.setEnvProdDebug();
  webpackRun(2);
});

gulp.task('build:clean', () => {
  return del(config.root(config.data.dest.prod));
});

gulp.task('build:test', () => {
  config.setEnvProdDebug();
  const wpConfig = webpackBuilder.buildConfig();
  const entryList = buildWebpackEntryList(wpConfig);

  //force source maps to be inlined with the source files,
  // so they can be picked up by sourcemap processor
  wpConfig.devtool = '#inline-source-map';

  //config.debugInspectAndExit(entryList);
  //config.debugInspectAndExit(wpConfig);

  const task = gulp.src(entryList)
    //.pipe(vinylNamed())

    .pipe(webpackStream(wpConfig, webpack/*, webpackStats*/)) // blend in the webpack config into the source files

    .pipe(sourcemaps.init({
      loadMaps: true,
      identityMap: true,
      debug: true,
    }))

/*    .pipe(through2((file, enc, cb) => {
      // Dont pipe through any source map files as it will be handled
      // by gulp-sourcemaps
      const isSourceMap = /\.map$/.test(file.path);
      config.info(this);
      if (!isSourceMap) {
        this.push(file);
      }
      cb();
    }))
*/
    .pipe(sourcemaps.write('./', {
      addComment: true,
      includeContent: false,
      sourceRoot: '../src3', //TBI: dynamically calculated
      destPath: gulp.dest(config.data.dest.prod),
      debug: true,
      //charset: 'utf8',
      //sourceMappingURLPrefix: 'https://asset-host.example.com/assets',
      //sourceMappingURL: (file) => { return 'https://asset-host.example.com/' + file.relative + '.map'; },
      //mapFile: (mapFilePath) => { return mapFilePath.replace('.js.map', '.map'); },
      //mapSources: (sourcePath) => { return '../src/' + sourcePath; },

      //mapFile: (mapFilePath) => { config.info(mapFilePath); return mapFilePath; },
      //mapSources: (sourcePath) => { config.info(sourcePath); return '../SRC/' + sourcePath; },
    }))

    .pipe(gulp.dest(config.data.dest.prod));

  return task;
});

//gulp.task('build', 'Build deployment packages.', ['build:clean', 'test:runonce', 'build:dual:debug']);
//gulp.task('build', 'Build deployment package.', ['build:clean', 'build:dual:debug']);
gulp.task('build', 'Build deployment package.', ['build:clean', 'build:test']);
