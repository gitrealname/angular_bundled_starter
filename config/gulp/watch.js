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
    entry[key].unshift('webpack-hot-middleware/client?reload=true');
  });
}

const defaultRequestUrlRoot = config.data.dev.requestServerHost + ':' + config.data.dev.requestServerPort + config.data.dev.requestServerRoot;

gulp.task('watch', 'Run dev server with "hot replacement"', () => {
  config.setEnvDev();
  config.setBackendServerUrlFromOrDefault('server');

  const webpackConfig = webpackBuilder.buildConfig();
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
          reasons: true,
          errorDetails: true,
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
          'Use Backend server for http requests.',
          'If not specified, all http request are processed by internal web server.',
          'Optional <URL root> determines backend server url root. Default: ' + config.data.dev.defaultBackendServerUrl,
          'When not specified. The internal web server serves data from "src/' + config.data.dir.mockServer + '".',
          'The Intrnal web server works in conjunction with "src/common/dev-service/requestMockServerProxy interceptor"',
          'The interceptor adjust url to point to json file that is located under directory that is named the same as request string',
          'All requests converted to GET request, but file name suffix will reflect original method name.',
          'Examples:',
          '   for $http.get(\'MyArea/SpecialController/GetXYZModel\') file "src/' + config.data.dir.mockServer + '/MyArea/SpecialController/GetXYZModel.json" will be sent back as a response;',
          '   for $http.put(....UpdateEntity...) <= "....UpdateEntity.PUT.json";',
    ].join('\n\t'),
  },
});

