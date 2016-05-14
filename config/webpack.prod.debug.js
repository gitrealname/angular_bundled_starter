/*eslint prefer-template: 0*/
/*eslint max-len: 0*/
/**
 * @author: FEi
 */

const config = require('./config');

config.setEnvProd();
config.setBuildDebug();

const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const prodConfig = require('./webpack.prod.js'); // the settings that are common to prod and dev
const commonConfig = require('./webpack.common.js');

/**
 * Webpack Plugins
 */

/*
 * Webpack production debug specific confinfiguration
 */

/**
 * Webpack Constants
 */
module.exports.options = webpackMerge(prodConfig.options, {
  output: commonConfig.buildOutput(),

  module: {
    loaders: commonConfig.buildLoaders(),
  },

  plugins: [
    prodConfig.buildUglifyJsPlugin(),
    commonConfig.buildExtractTextPlugin(),
    commonConfig.buildDefinePlugin(),
  ],
});
