/*eslint prefer-template: 0*/
/*eslint max-len: 0*/
/**
 * @author: FEi
 */

const config = require('./config');

config.setEnvProd();
config.setBuildRelease();

const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev


/**
 * Webpack Plugins
 */
//const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

/*
 * Webpack configurations building api that produces various configuration settings
 *  based on current environment (e.g. 'production' vs 'development')
 *  and build type (e.g. 'release' vs 'debug')
 */

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

/**
 * Webpack Constants
 */
module.exports.options = webpackMerge(commonConfig.options, {

  /**
   * Switch loaders to debug mode.
   *
   * See: http://webpack.github.io/docs/configuration.html#debug
   */
  debug: false,

  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  devtool: 'source-map',

  output: commonConfig.buildOutput(),

  module: {
    loaders: commonConfig.buildLoaders(),
  },

  plugins: [

    /**
     * Plugin: WebpackMd5Hash
     * Description: Plugin to replace a standard webpack chunkhash with md5.
     *
     * See: https://www.npmjs.com/package/webpack-md5-hash
     */
    //new WebpackMd5Hash(),

    /**
     * Plugin: DedupePlugin
     * Description: Prevents the inclusion of duplicate code into your bundle
     * and instead applies a copy of the function at runtime.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
     * See: https://github.com/webpack/docs/wiki/optimization#deduplication
     */
    new DedupePlugin(),

    /*
     * Plugin: OccurenceOrderPlugin
     * Description: Varies the distribution of the ids to get the smallest id length
     * for often used ids.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
     * See: https://github.com/webpack/docs/wiki/optimization#minimize
     */
    //new webpack.optimize.OccurrenceOrderPlugin(true),

    /**
     * Plugin: UglifyJsPlugin
     * Description: Minimize all JavaScript output of chunks.
     * Loaders are switched into minimizing mode.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
     */
    buildUglifyJsPlugin(),

    commonConfig.buildExtractTextPlugin(),

    commonConfig.buildDefinePlugin(),

    /**
     * Plugin: CompressionPlugin
     * Description: Prepares compressed versions of assets to serve
     * them with Content-Encoding
     *
     * See: https://github.com/webpack/compression-webpack-plugin
     */
    //new CompressionPlugin({
    //  regExp: /\.css$|\.html$|\.js$|\.map$/,
    //  threshold: 2 * 1024,
    //}),
  ],

  /**
   * Static analysis linter for JavaScript advanced options configuration
   * Description: An extensible linter for the TypeScript language.
   *
   * See: https://www.npmjs.com/package/eslint-loader
   */
  eslint: {
    emitErrors: true,
    emitWarning: true,
    failOnError: true,
    failOnWarning: true,
  },

  /**
   * Static analysis linter for TypeScript advanced options configuration
   * Description: An extensible linter for the TypeScript language.
   *
   * See: https://github.com/wbuchwalter/tslint-loader
   */
  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: 'src',
  },

  /*
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: { },
});
