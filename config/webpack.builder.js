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
    ngModulesList: '\'' + Object.keys(config.data.entryMap).join('\', \'') + '\'',
  };
  return ret;
}
module.exports.buildMetadata = buildMetadata;

function buildOutput() {
  if (config.isEnvTest()) {
    return {
    };
  }

  let path = config.root(config.data.dest.prod);
  let publicPath = '';
  let suffix = '.';
  if (config.isEnvDev()) {
    path = config.rootSrc();
    publicPath = '/';
  }
  if (config.isBuildRelease()) {
    suffix = '.min.';
  }

  return {
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
    modulesDirectories: ['node_modules'],
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
  const excRx = excludeRx();

  let lst = [
    {
      test: /\.js$/,
      exclude: [
        /node_modules/,
        excRx,
      ],
      loader: 'ng-annotate!babel?compact=false',
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
    { test: /\.styl$/, loader: styleLoader(`?sourceMap&${m}!stylus?sourceMap`) },
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
    { test: /\.html$/, loader: 'html', exclude: [config.rootSrc('index.html')] },

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
  };
}
module.exports.buildModule = buildModule;

function buildExtractTextPlugin() {
  let suffix = '.';
  let disable = false;
  if (config.isEnvProd() && config.isBuildRelease()) {
    suffix = '.min.';
  }
  if (config.isEnvDev()) {
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
      'process.env': JSON.stringify(config.env),
    }),
  ];

  if (config.isEnvTest()) {
  } else {
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
        name: 'common',
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
    ]);
  }

  if (config.isEnvDev()) {
    plst = plst.concat([
      // Adds webpack HMR support. It act's like livereload,
      // reloading page after webpack rebuilt modules.
      // It also updates stylesheets and inline assets without page reloading.
      new webpack.HotModuleReplacementPlugin(),

      new webpack.NoErrorsPlugin(),
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
      new CopyWebpackPlugin([{
        from: config.data.dir.data,
        to: config.data.dir.data,
      }]),
    ]);
  }

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
  if (!config.isEnvDev()) {
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
  const cfg = {
    hot: true,
    inline: true,
    port: config.data.dev.port.port,
    host: config.data.dev.host,
    historyApiFallback: {
      index: config.data.file.index,
      //define bundle specific index pages
      //rewrites,
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    outputPath: config.root(config.data.dest.dev),
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

    /**
     * Switch loaders to debug mode.
     *
     * See: http://webpack.github.io/docs/configuration.html#debug
     */
    debug: !config.isEnvProd(),

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
