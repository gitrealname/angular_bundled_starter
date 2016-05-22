/*eslint prefer-template: 0*/
/*eslint max-len: 0*/

/*
* See: https://www.npmjs.com/package/gulp-help
*/
const gulp = require('gulp-help')(require('gulp'));
import webpack from 'webpack';
import webpackBuilder from '../webpack.builder.js';
import browserSync from 'browser-sync';
import webpackDevMiddelware from 'webpack-dev-middleware';
import webpackHotMiddelware from 'webpack-hot-middleware';
import colorsSupported from 'supports-color';
import historyApiFallback from 'connect-history-api-fallback';


import config from '../config';

function prependEntriesWithHotMiddleware(entry) {
  Object.keys(entry).forEach((key) => {
    // 'webpack-hot-middleware/client?reload=true' required to make HRM working
    // it responsible for all this webpack magic.
    //NOTE: magic doesn't seem to be working correctly with angular
    //  see index.html for logic that forces reload after change.
    entry[key].push('webpack-hot-middleware/client?reload=true');
  });
}

gulp.task('watch', 'run dev server with "hot replacement"', () => {
  config.setEnvDev();
  const webpackConfig = webpackBuilder.buildConfig();
  //attemp to find out why page reload doesn't happen: const webpackConfig = require('../webpack.dev.config');
  prependEntriesWithHotMiddleware(webpackConfig.entry);

  //config.debugInspectAndExit(webpackConfig);

  const webpackCompiler = webpack(webpackConfig);

  browserSync({
    port: config.data.dev.port,
    open: false,
    server: { baseDir: config.rootSrc() },
    middleware: [
      historyApiFallback(),
      webpackDevMiddelware(webpackCompiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false,
        },
        publicPath: webpackConfig.output.publicPath,
      }),
      webpackHotMiddelware(webpackCompiler),
    ],
  });
});

