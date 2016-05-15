/*eslint prefer-template: 0*/

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
    // it responsible for all this webpack magic
    entry[key].unshift('webpack-hot-middleware/client');
  });
}

gulp.task('watch', 'run dev server with "hot replacement"', () => {
  config.setEnvDev();
  const cfg = webpackBuilder.buildConfig();
  prependEntriesWithHotMiddleware(cfg.entry);
  //config.debugInspectAndExit(cfg);
  const wp = webpack(cfg);
  browserSync({
    open: false,
    port: config.data.dev.port,
    server: {
      baseDir: config.rootSrc(),
    },
    middleware: [
      historyApiFallback(),
      webpackDevMiddelware(wp, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false,
        },
        publicPath: cfg.output.publicPath,
      }),
      webpackHotMiddelware(wp, {
        hot: true,
        quiet: false, //disable all console logging
        noInfo: false, //Set to true to disable informational console logging.
        reload: true,
      }),
    ],
  });
});

