/*eslint prefer-template: 0*/
/*eslint max-len: 0*/
/**
 * @author: FEi
 */
const config = require('./config');

config.setEnvTest();

const webpackBuilder = require('./webpack.builder.js');

const cfg = webpackBuilder.buildConfig();
//config.debugInspectAndExit(wp);

module.exports = (karmaConfig) => {
  karmaConfig.set({

    // Webpack Config at ./webpack.test.js
    webpack: cfg,

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: config.rootConfig(),

    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['mocha', 'chai', 'jasmine', 'sinon'],

    // list of files to exclude
    exclude: [],

    plugins: [
      'karma-chai',
      'karma-sinon',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage',
      'karma-babel-preprocessor',
    ],

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [
      //{ pattern: './config.js', watched: false },
      { pattern: './spec.bundle.js', watched: false },
    ],

    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: {
      //'./config.js': ['webpack'],
      './spec.bundle.js': ['coverage', 'webpack', 'sourcemap'],
    },

    //babelPreprocessor: {
    //  options: {
    //    sourceMap: 'inline',
    //    presets: ['es2015'],
    //  },
    //},

    coverageReporter: {
      dir: config.data.dest.coverage + '/',
      reporters: [
        { type: 'text-summary' },
        { type: 'json' },
        { type: 'html' },
      ],
    },

    // Webpack please don't spam the console when running in karma!
    webpackServer: { noInfo: true },

    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    //NOTE: is being overriden by gulp/test.js
    reporters: ['dots'],

    // web server port
    port: config.data.test.port,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR
     *  || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: karmaConfig.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    /*
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: [
      // 'Chrome',
      'PhantomJS',
    ],

    /*
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: true,
  });
};
