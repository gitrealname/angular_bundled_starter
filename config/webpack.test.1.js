/*eslint no-trailing-spaces:0*/
/*eslint max-len:0*/
/**
 * @author: @FEi
 */

const config = require('./config');

config.setEnvTest();

const DefinePlugin = require('webpack/lib/DefinePlugin');

function styleLoader(str) {
  if (!config.isEnvProd()) {
    return `style!css${str}`;
  } else {
    //return ExtractTextPlugin.extract('style', `css${str}`);
  }
}

const m = '-minimize';

module.exports.options = {

  context: config.rootSrc(),

  devtool: 'inline-source-map',

  debug: !config.isEnvProd(),

  resolve: {

    extensions: ['', '.ts', '.js'],

    root: config.rootSrc(),

    modulesDirectories: ['node_modules'],
    alias: { },
  },

  module: {

    preLoaders: [
      { test: /\.js$/, loader: 'eslint-loader', exclude: [/node_modules/] },
      { test: /\.ts$/, loader: 'tslint-loader', exclude: [/node_modules/] },
      { test: /\.js$/, loader: 'source-map-loader', exclude: [
        /ui-router/,
      ] },
    ],

    loaders: [

      //{ test: /\.js$/, loader: 'ng-annotate!babel?compact=false', exclude: [/\.e2e\.js$/, /node_modules/] },
      { test: /\.js$/,
        exclude: [
          /node_modules/,
          /\.(e2e)\.(js|ts)$/,
        ],
        loader: 'ng-annotate!babel?compact=false',
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [/\.e2e\.ts$/, /node_modules/],
      },

      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' },
      { test: /\.css$/, loader: styleLoader(`?sourceMap&${m}`) },
      { test: /\.styl$/, loader: styleLoader(`?sourceMap&${m}!stylus?sourceMap`) },
      { test: /\.less$/, loader: styleLoader(`?sourceMap&${m}!less?sourceMap`) },

      { test: /\.json$/, loader: 'json' },
      { test: /\.html$/, loader: 'html', exclude: [config.rootSrc('index.html')] },
    ],

    postLoaders: [

      {
        test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
        include: config.root('src'),
        exclude: [
          /\.(e2e|spec)\.(js|ts)$/,
          /node_modules/,
        ],
      },
    ],
  },

  plugins: [

    new DefinePlugin({
      'process.env': config.env,
    }),
  ],

  eslint: {
    emitErrors: true,
    emitWarning: true,
    failOnError: true,
    failOnWarning: false,
  },

  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: 'src',
  },

  node: {
    global: 'window',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },
};
