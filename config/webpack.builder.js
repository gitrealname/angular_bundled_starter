/*eslint prefer-template: 0*/
/*eslint max-len: 0*/
/**
 * @author: FEi
 */

const webpack = require('webpack');
const config = require('./config');

/*
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

/*
 * Webpack configurations building api that produces various configuration settings
 *  based on current environment (e.g. 'production' vs 'development' vs 'test')
 *  and build type (e.g. 'release' vs 'debug')
 */


function buildMetadata() {
  const ret = {
    title: 'Modular Angular-Webpack kit',
    env: config.env,
    baseUrl: '/',
    ngModulesList: '\'' + config.env.APP_BUNDLE_MODULES.map((v) => config.data.dotedAppPrefix + v).join('\', \'') + '\'',
  };
  //config.debugInspectAndExit(ret);
  return ret;
}
module.exports.buildMetadata = buildMetadata;

function buildOutput() {
  let path = config.root(config.data.dest.prod);
  let publicPath = '/';
  let suffix = '.';
  if (config.isEnvDev() || config.isEnvTest()) {
    path = config.rootSrc();
    publicPath = '/';
  }
  if (config.isBuildRelease()) {
    suffix = '.min.';
  }
  if (config.isEnvTest() && config.isWatched()) {
    suffix = '.[chunkhash].';
  }

  const ret = {
    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path,

    /**
     * The public URL address of the output files when referenced in a browser.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-publicpath
     */
    publicPath,

    /**
     * Specifies the name of each output file on disk.
     * IMPORTANT: You must not specify an absolute path here!
     *
     * See: http://webpack.github.io/docs/configuration.html#output-filename
     */
    filename: '[name]' + suffix + 'js',

    /**
     * The filename of the SourceMaps for the JavaScript files.
     * They are inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
     */
    sourceMapFilename: '[file].map',

    /**
     * The filename of non-entry chunks as relative path
     * inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
     */
    chunkFilename: '[id].chunk' + suffix + 'js',
  };

  /**
   * See: http://webpack.github.io/docs/configuration.html#output-devtoolmodulefilenametemplate
  */
  //IMPORTANT: build:sourcemap:fix gulp task depends very havely on
  // format of the source map. Any change here must propogated into
  // build:sourcemap:fix bulp task!!!!!
  ret.devtoolModuleFilenameTemplate = (info) => {
    const rp = info.resourcePath;
    let nrp = rp;
    if (rp.match(/^\.\.\/~/)) {
      //move node_modules under ./.node_modules pseudo directory
      nrp = './.node_modules' + rp.slice(4);
    } else if (rp.match(/(html|json)$/)) {
      //keep html and json files without any change
      nrp = info.resourcePath;
    } else if (rp.match(/(styl|less|sass|css)$/) && config.isEnvProd()) {
      //resource Path for styles looks extrimly "strange", example:
      // 1) webpack:///bundles/test/src/bundles/test/test.styl
      // 2) webpack:///bundles/test/test.styl
      // and in rality 1) is an actual source, while 2) is already translated by loaders.
      //Therefore: correct 1) and move 2) under '.' directory
      //styles being kept in separate directory for easy of correction during build (see build.js)
      nrp = rp.replace(/^webpack:\/{3}/, '/');
      const chunks = nrp.split(config.data.dir.src);
      if (chunks.length === 2 && chunks[1].indexOf(chunks[0]) === 0) {
        nrp = '.' + chunks[1];
      } else {
        nrp = '~/.' + nrp + '?' + info.hash + (info.moduleId ? '-' + info.moduleId : '');
      }
    } else {
      nrp = '~/' + info.resourcePath + '?' + info.hash + (info.moduleId ? '-' + info.moduleId : '');
    }

    //console.log(nrp);
    return nrp;
  };

  ret.devtoolFallbackModuleFilenameTemplate = (info) => {
    const rp = info.resourcePath;
    let nrp = rp;
    if (rp.match(/\.(js|ts)/)) {
    //restore original name only for source files (js|ts)
    //keep everything else in '~/' folder
      nrp = info.resourcePath;
    } else {
      nrp = '~/' + info.resourcePath + '?' + info.hash + (info.moduleId ? '-' + info.moduleId : '');
    }

    //console.log('--> ' + nrp);
    return nrp;
  };

  return ret;
}
module.exports.buildOutput = buildOutput;

function buildEntry() {
  if (config.isEnvTest()) {
    return { };
  }
  const entries = { };
  Object.keys(config.data.entryMap).forEach((k) => {
    const h = config.data.entryMap[k];
    entries[k] = [config.rootSrc(h.script)];
  });
  return entries;
}
module.exports.buildEntry = buildEntry;

function buildResolve() {
  function buildAlias() {
  }

  return {
    /*
    * An array of extensions that should be used to resolve modules.
    *
    * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
    */
    extensions: ['', '.ts', '.js', '.styl', '.less', '.css'], //Should they be included??? '.styl', '.less', '.css'],

    // Make sure root is src
    root: [config.rootSrc()],

    // remove other default values
    modulesDirectories: [config.data.dir.node],
    alias: buildAlias(),
  };
}
module.exports.buildResolve = buildResolve;

function buildPreLoaders() {
  return [
    /*
    * eslint loader support form *.js files
    *
    * See: https://www.npmjs.com/package/eslint-loader
    */
    { test: /\.js$/, loader: 'eslint-loader', exclude: [/node_modules/] },
    /*
    * Tslint loader support for *.ts files
    *
    * See: https://github.com/wbuchwalter/tslint-loader
    */
    { test: /\.ts$/, loader: 'tslint-loader', exclude: [/node_modules/] },

    /*
    * Source map loader support for *.js files
    * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
    *
    * See: https://github.com/webpack/source-map-loader
    */
    { test: /\.js$/, loader: 'source-map-loader', exclude: [
      // these packages have problems with their sourcemaps
      /ui-router/,
    ] },
  ];
}
module.exports.buildPreLoaders = buildPreLoaders;

function buildLoaders() {
  function styleLoader(str) {
    if (!config.isEnvProd()) {
      return `style!css${str}`;
    } else {
      return ExtractTextPlugin.extract('style', `css${str}`);
    }
  }
  function excludeRx() {
    if (config.isEnvTest()) {
      return /\.(e2e)\.(js|ts)$/;
    } else {
      return /\.(spec|e2e)\.(js|ts)$/;
    }
  }

  const m = config.isBuildDebug() ? '-minimize' : 'minimize';
  const cache = !config.isEnvProd() ? '?cacheDirectory' : '';
  const excRx = excludeRx();
  const src = config.rootSrc();
  let lst = [
    {
      test: /\.js$/,
      exclude: [
        /node_modules/,
        excRx,
      ],
      loader: `ng-annotate!babel${cache}`,
    },

    /*
      * Typescript loader support for .ts and Angular 2 async routes via .async.ts
      *
      * See: https://github.com/s-panferov/awesome-typescript-loader
      */
    { test: /\.ts$/,
      loader: 'awesome-typescript-loader',
      exclude: [excRx, /node_modules/],
    },

    { test: /\.png$/, loader: 'url-loader?limit=1024' },
    { test: /\.jpg$/, loader: 'file-loader' },
    { test: /\.css$/, loader: styleLoader(`?sourceMap&${m}`) },
    { test: /\.styl$/, loader: styleLoader(`?sourceMap&${m}!stylus?sourceMap&paths=` + src + '/') },
    { test: /\.less$/, loader: styleLoader(`?sourceMap&${m}!less?sourceMap`) },
    { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader' },
    { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader' },
    /*
      * Json loader support for *.json files.
      *
      * See: https://github.com/webpack/json-loader
      */
    { test: /\.json$/, loader: 'json' },

    /* Html loader support for *.html
      *
      * See: https://github.com/webpack/html-loader
      */
    { test: /\.html$/, loader: 'html?-attrs', exclude: [config.rootSrc('index.html')] },

  ];

  if (!config.isEnvTest()) {
    lst = lst.concat([
      /*
      * use expose-loader to expose modules to the we browser window object
      *
      * See: https://github.com/webpack/expose-loader
      */
      //{ test: /react\.js$/, loader: 'expose?React' },
      { test: /jquery\.js$/, loader: 'expose?$!expose?jQuery' },
      //{ test: /pouchdb\.js$/, loader: 'expose?pouchdb' },
      //{ test: /angular\.js$/, loader: 'expose?angular' },
    ]);
  }

  return lst;
}
module.exports.buildLoaders = buildLoaders;

function buildPostLoaders() {
  if (!config.isEnvTest()) {
    return [];
  }
  //ENV Test:
  return [
    /**
     * Instruments JS files with Istanbul for subsequent code coverage reporting.
     * Instrument only testing sources.
     *
     * See: https://github.com/deepsweet/istanbul-instrumenter-loader
     */
    {
      test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
      include: config.root('src'),
      exclude: [
        /\.(e2e|spec)\.(js|ts)$/,
        /node_modules/,
      ],
    },
  ];
}
module.exports.buildPostLoaders = buildPostLoaders;

function buildModule() {
  return {
    preLoaders: buildPreLoaders(),
    loaders: buildLoaders(),
    postLoaders: buildPostLoaders(),
    noParse: [
      config.rootNode('angular'),
      config.rootNode('angular-route'),
      config.rootNode('angular-ui-router'),
      config.rootNode('angular-mocks'),
      config.rootNode('jquery'),
      config.rootNode('kendo-ui-core'),
    ],
  };
}
module.exports.buildModule = buildModule;

function buildExtractTextPlugin() {
  let suffix = '.';
  let disable = false;
  if (config.isEnvProd() && config.isBuildRelease()) {
    suffix = '.min.';
  }
  if (config.isEnvDev() || config.isEnvTest()) {
    disable = true;
  }

  /*
    * Plugin: ExtractTextPlugin
    * See: https://github.com/webpack/extract-text-webpack-plugin
    */
  return new ExtractTextPlugin('[name]' + suffix + 'css', {
    disable,
  });
}
module.exports.buildExtractTextPlugin = buildExtractTextPlugin;

function buildUglifyJsPlugin() {
  if (config.isBuildRelease()) {
    return new UglifyJsPlugin({
      beautify: false,
      comments: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
        // You can specify all variables that should not be mangled.
        // For example if your vendor dependency doesn't use modules
        // and relies on global variables. Most of angular modules relies on
        // angular global variable, so we should keep it unchanged
        except: ['$super', '$', 'exports', 'require', 'angular'],
      },
      compress: {
        screw_ie8: true,
        warnings: false,
      },
    });
  } else {
    return new UglifyJsPlugin({
      unused: false,
      deadCode: false,
      beautify: true,
      comments: true,
      mangle: false,
      compress: {
        screw_ie8: true,
        keep_fnames: true,
        drop_debugger: false,
        dead_code: false,
        unused: false,
        warnings: false,
      },
    });
  }
}
module.exports.buildUglifyJsPlugin = buildUglifyJsPlugin;

function buildPlugins() {
  let plst = [
    /*
    *
    * Plugin: ForkCheckerPlugin
    * Description: Do type checking in a separate process, so webpack don't need to wait.
    *
    * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
    */
    new ForkCheckerPlugin(),

    /**
     * Plugin: DefinePlugin
     * Description: Define free variables.
     * Useful for having development builds with debug logging or adding global constants.
     *
     * Environment helpers
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
     */
    // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
    new DefinePlugin({
      'process.env': {
        ENV: JSON.stringify(config.env.ENV),
        ONLY_BUNDLE: config.env.ONLY_BUNDLE,
        CONST_ENV_DEV: JSON.stringify(config.env.CONST_ENV_DEV),
        CONST_ENV_PROD: JSON.stringify(config.env.CONST_ENV_PROD),
        CONST_ENV_TEST: JSON.stringify(config.env.CONST_ENV_TEST),
        BUNDLES: JSON.stringify(config.env.BUNDLES),
        BACKEND_SERVER_URL: JSON.stringify(config.env.BACKEND_SERVER_URL),
        MOCK_SERVER_DIR: JSON.stringify(config.env.MOCK_SERVER_DIR),
      },
    }),
  ];

  if (!config.isEnvTest()) {
    plst = plst.concat([
      /*
      * Plugin: HtmlWebpackPlugin
      * Description: Simplifies creation of HTML files to serve your webpack bundles.
      * This is especially useful for webpack bundles that include a hash in the filename
      * which changes every compilation.
      *
      * See: https://github.com/ampedandwired/html-webpack-plugin
      * See: https://docs.omniref.com/js/npm/html-webpack-plugin/1.0.1
      */
      new HtmlWebpackPlugin({
        template: './' + config.data.file.index,
        filename: config.data.file.index,
        inject: false, // scripts are manually injected 'body',
        hash: false,
        showErrors: true,
        chunksSortMode: 'dependency',
        // requires HtmlWebpackHarddiskPlugin: alwaysWriteToDisk: true,
      }),

      //new HtmlWebpackHarddiskPlugin(),

      /*
      * Plugin: CommonsChunkPlugin
      * Description: Shares common code between the pages.
      * It identifies common modules and put them into a commons chunk.
      *
      * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
      * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
      */
      new webpack.optimize.CommonsChunkPlugin({
        name: config.data.dir.common,
      }),

      // Automatically move all modules defined outside of application directory to vendor bundle.
      // If you are using more complicated project structure,
      //  consider to specify common chunks manually.
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module, count) => {
          return module.resource && module.resource.indexOf(config.rootNode()) !== -1;
        },
      }),

      buildExtractTextPlugin(),

      new webpack.NoErrorsPlugin(),
    ]);
  }

  if (config.isEnvDev()) {
    plst = plst.concat([
      // Adds webpack HMR support. It act's like livereload,
      // reloading page after webpack rebuilt modules.
      // It also updates stylesheets and inline assets without page reloading.
      new webpack.HotModuleReplacementPlugin(),
    ]);
  }

  if (config.isEnvProd()) {
    plst = plst.concat([
      /**
       * Plugin: DedupePlugin
       * Description: Prevents the inclusion of duplicate code into your bundle
       * and instead applies a copy of the function at runtime.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       * See: https://github.com/webpack/docs/wiki/optimization#deduplication
       */
      new DedupePlugin(),

      buildUglifyJsPlugin(),
    ]);
  }

  if (config.isWatched()) {
    plst = plst.concat([
      /**
       * See: http://webpack.github.io/docs/list-of-plugins.html#prefetchplugin
       */
      new webpack.PrefetchPlugin(config.rootNode(), 'core-js/shim.js'),
      new webpack.PrefetchPlugin(config.rootNode(), 'angular'),
    ]);
  }

  if (config.data.currentDest.length) {
    plst = plst.concat([
      /*
      * Plugin: CopyWebpackPlugin
      * Description: Copy files and directories in webpack.
      *
      * Copies project static assets.
      *
      * See: https://www.npmjs.com/package/copy-webpack-plugin
      */
      new CopyWebpackPlugin([{
        from: config.data.dir.assets,
        to: config.data.dir.assets,
      }]),
    ]);

    //don't copy test server data to prod dist directory
    if (!config.isEnvProd()) {
      plst = plst.concat([
        new CopyWebpackPlugin([{
          from: config.data.dir.devData,
          to: config.data.dir.devData,
        }]),
      ]);
    }
  } // if (config.data.currentDest.length)

  return plst;
}
module.exports.buildPlugins = buildPlugins;

function buildHtmlLoader() {
  return {
    minimize: config.isEnvProd(),
    removeAttributeQuotes: false,
    caseSensitive: true,
    customAttrSurround: [
      [/#/, /(?:)/],
      [/\*/, /(?:)/],
      [/\[?\(?/, /(?:)/],
    ],
    customAttrAssign: [/\)?\]?=/],
  };
}
module.exports.buildHtmlLoader = buildHtmlLoader;

function buildNode() {
  return {
    global: 'window',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false,
  };
}
module.exports.buildNode = buildNode;

function buildDevServer() {
  if (!config.isEnvDev() && !config.isEnvTest()) {
    return { };
  }
/*
    const rewrites = Object.keys(config.data.entryMap)
    .filter((k) => !config.data.entryMap[k].isCommon)
    .map((k) => {
      const from = '/\\/' + k + '/';
      const to = '/' + config.data.entryMap[k].html;
      return { from, to };
    });
*/
  /**
   * See https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli
   */
  const cfg = {
    hot: true,
    inline: true,
    colors: true,
    port: config.data.dev.port.port,
    host: config.data.dev.host,
    historyApiFallback: {
      index: config.data.file.index,
      //define bundle specific index pages
      //rewrites,
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 250,
    },
    outputPath: config.data.dest.dev ? config.root(config.data.dest.dev) : config.rootSrc(),
    stats: {
      colors: true,
      modules: true,
      reasons: true,
      errorDetails: true,
    },
  };
  return cfg;
}
module.exports.buildDevServer = buildDevServer;

function buildEsLint() {
  const opt = {
    emitErrors: true,
    emitWarning: true,
    failOnError: true,
    failOnWarning: true,
  };
  if (config.isEnvDev()) {
    opt.failOnError = false;
    opt.failOnWarning = false;
  } else if (config.isEnvTest()) {
    opt.failOnWarning = false;
  }
  return opt;
}
module.exports.buildEsLint = buildEsLint;

function buildTsLint() {
  const opt = {
    emitErrors: true,
    failOnHint: true,
    resourcePath: config.data.dir.src,
  };
  if (config.isEnvDev()) {
    opt.emitErrors = false;
    opt.failOnHint = false;
  }
  return opt;
}
module.exports.buildTsLint = buildTsLint;

function buildDevTool() {
  if (config.isEnvProd()) {
    return 'source-map';
  } else if (config.isEnvDev()) {
    return 'cheap-module-source-map';
  } else {
    return 'inline-source-map';
  }
}
module.exports.buildDevTool = buildDevTool;

/*
* Webpack configuration
*
* See: http://webpack.github.io/docs/configuration.html#cli
*/
function buildConfig() {
  return {
    context: config.rootSrc(),

    cache: (config.isEnvProd() ? false : {}),

    /**
     * Switch loaders to debug mode.
     *
     * See: http://webpack.github.io/docs/configuration.html#debug
     */
    debug: false, //!config.isEnvProd(),

    /**
     * Developer tool to enhance debugging
     *
     * See: http://webpack.github.io/docs/configuration.html#devtool
     * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    devtool: buildDevTool(),

    /*
    * Static metadata for index.html
    *
    * See: (custom attribute)
    */
    metadata: buildMetadata(),

    /*
    * Cache generated modules and chunks to improve performance for multiple incremental builds.
    * This is enabled by default in watch mode.
    * You can pass false to disable it.
    *
    * See: http://webpack.github.io/docs/configuration.html#cache
    * cache: false,
    *
    * The entry point for the bundle
    * Our Angular.js app
    *
    * See: http://webpack.github.io/docs/configuration.html#entry
    */
    entry: buildEntry(),

    /*
    * Options affecting the output of the compilation.
    *
    * See: http://webpack.github.io/docs/configuration.html#output
    */
    output: buildOutput(),

    /*
    * Options affecting the resolving of modules.
    *
    * See: http://webpack.github.io/docs/configuration.html#resolve
    */
    resolve: buildResolve(),

    /*
    * Options affecting the normal modules.
    *
    * See: http://webpack.github.io/docs/configuration.html#module
    */
    module: buildModule(),

    /*
    * Add additional plugins to the compiler.
    *
    * See: http://webpack.github.io/docs/configuration.html#plugins
    */
    plugins: buildPlugins(),

    /**
     * Static analysis linter for JavaScript advanced options configuration
     * Description: An extensible linter for the TypeScript language.
     *
     * See: https://www.npmjs.com/package/eslint-loader
     */
    eslint: buildEsLint(),

    /**
     * Static analysis linter for TypeScript advanced options configuration
     * Description: An extensible linter for the TypeScript language.
     *
     * See: https://github.com/wbuchwalter/tslint-loader
     */
    tslint: buildTsLint(),

    /**
     * Webpack Development Server configuration
     * Description: The webpack-dev-server is a little node.js Express server.
     * The server emits information about the compilation state to the client,
     * which reacts to those events.
     *
     * See: https://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: buildDevServer(),

    /*
    * Html loader advanced options
    *
    * See: https://github.com/webpack/html-loader#advanced-options
    */
    // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
    htmlLoader: buildHtmlLoader(),

    /*
    * Include polyfills or mocks for various node stuff
    * Description: Node configuration
    *
    * See: https://webpack.github.io/docs/configuration.html#node
    */
    node: buildNode(),
  };
}
module.exports.buildConfig = buildConfig;
