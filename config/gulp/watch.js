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

const defaultRequestUrlRoot = config.data.dev.requestServerHost + ':' + config.data.dev.requestServerPort + config.data.dev.requestServerRoot;

gulp.task('watch', 'run dev server with "hot replacement"', () => {
  config.setEnvDev();
  const webpackConfig = webpackBuilder.buildConfig();
  //attemp to find out why page reload doesn't happen: const webpackConfig = require('../webpack.dev.config');
  prependEntriesWithHotMiddleware(webpackConfig.entry);

  //config.debugInspectAndExit(webpackConfig);

  const webpackCompiler = webpack(webpackConfig);

  browserSync({
    port: config.data.dev.port,
    open: config.getProcessingFlag('open') !== undefined || false,
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
}, {
  options: {
    'name <bundle-name>, -n <bundle-name>': ['',
          'Optional. Bundle names that will be watched.',
          'The \'common\' is always watched.',
          'If not specified all bundles will be watched.',
          'Multiple \'--name\' options can be specified.',
    ].join('\n\t'),
    'open, -o': ['',
          'Optional. If specified, opens default browser with development server url.',
    ].join('\n\t'),
    'server [<URL root>], -s [<URL root>]': ['',
          'TBD: Optional. Url where all http requests will be re-directed to.',
          'When not specified, all requests get processed by webpack-dev-server',
          ' relative to \'' + config.data.dir.devData + '\'.',
          'Optional <URL root> defines default request Url root.',
          'If <Url root> is not specified. \'' + defaultRequestUrlRoot + '\' will be used.',
          'It works in conjunction with \'common/services/requestProxy.service\'',
          ' which adjusts URLs depending on environment and specified parameter.',
          'Example, assuming \'--server ' + defaultRequestUrlRoot + '\':',
          ' $http.get(/MyArea/SpecialController/DataAction) ==> ' + defaultRequestUrlRoot + '/MyArea/SpecialController/DataAction',
          'Example, assuming that \'--server\' (no parameter value):',
          ' $http.get(/MyArea/SpecialController/DataAction) ==> ' + config.data.dev.url + '/' + config.data.dir.devData + '/MyArea/SpecialController/DataAction',
          'NOTE: when --server is not specified, \'common/services/requestProxy.service\' changes all POST, PUT, DELETE methods into GET.',
    ].join('\n\t'),
  },
});

