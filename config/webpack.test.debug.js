const DefinePlugin = require('webpack/lib/DefinePlugin');
const config = require('./config');

module.exports = {
  context: 'D:\\work\\ngWebpackMvc4\\ngWebpackMvc4\\App_Js\\src',
  //debug: true,
  devtool: 'inline-source-map',
  //metadata: { title: 'TBD' },
  //entry: {},
  //output: {},
  resolve:
   { extensions: ['', '.ts', '.js'],
     root: 'D:\\work\\ngWebpackMvc4\\ngWebpackMvc4\\App_Js\\src',
     //modulesDirectories: ['node_modules'],
     //alias: {}
    },
  module:
   { preLoaders:
      [{ test: /\.js$/,
          loader: 'eslint-loader',
          exclude: [/node_modules/] },
        { test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: [/node_modules/] },
        { test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [/angular-ui-router/] }] },
  loaders: [
        { test: /\.js$/,
          loader: 'ng-annotate!babel?compact=false',
          exclude: [/\.e2e\.js$/, /node_modules/] },
        { test: /\.png$/, loader: 'url-loader?limit=100000' },
        { test: /\.jpg$/, loader: 'file-loader' },
/*        { test: /\.css$/, loader: 'style!css?sourceMap&-minimize' },
        { test: /\.styl$/, loader: 'style!css?sourceMap&-minimize!stylus?sourceMap' },
        { test: /\.less$/, loader: 'style!css?sourceMap&-minimize!less?sourceMap' },
*/
        { test: /\.css$/, loader: 'style!css' },
        { test: /\.styl$/, loader: 'style!css!stylus' },
        { test: /\.less$/, loader: 'style!css!less' },
        { test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          query: { compilerOptions: { removeComments: true } },
          exclude: [/\.e2e\.ts$/, /node_modules/],
        },
        { test: /\.json$/, loader: 'json' },
        { test: /\.html$/,
          loader: 'raw-loader',
          exclude: [/index/],
        },
  ],
  postLoaders:
      [{ test: /\.(js|ts)$/,
          loader: 'istanbul-instrumenter-loader',
          include: 'D:\\work\\ngWebpackMvc4\\ngWebpackMvc4\\App_Js\\src',
          exclude: [/\.(e2e|spec)\.(js|ts)$/, /node_modules/] }],
  plugins: [
    new DefinePlugin({
      'process.env': config.env,
    }),
  ],
  eslint:
   { emitErrors: true,
     emitWarning: true,
     failOnError: true,
     failOnWarning: false },
  tslint: { emitErrors: true, failOnHint: true, resourcePath: 'src' },
  //devServer: {},
  //htmlLoader:
  // { minimize: false,
  //   removeAttributeQuotes: false,
  //   caseSensitive: true,
  //   customAttrSurround: [[/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/]],
  //   customAttrAssign: [/\)?\]?=/] },
  node:
   { global: 'window',
     process: false,
     module: false,
     clearImmediate: false,
     setImmediate: false },
};
