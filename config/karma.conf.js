/*eslint prefer-template: 0*/
/*eslint max-len: 0*/
/**
 * @author: FEi
 */
const config = require('./config');

const webpackBuilder = require('./webpack.builder.js');

const cfg = webpackBuilder.buildConfig();
//config.debugInspectAndExit(cfg);

//NOTE: some options get overridden from gulp/test.js depending on testing mode

module.exports = (karmaConfig) => {
  karmaConfig.set({

    webpack: cfg,

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: config.rootConfig(),

    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['mocha', 'chai', 'sinon'],

    // list of files to exclude
    exclude: [],

    plugins: [
      'karma-chai',
      'karma-sinon',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage',
    ],

    /**
     * Mocha reporter options
     *
     * see: https://www.npmjs.com/package/karma-mocha-reporter
     */
    mochaReporter: {
      output: 'full',
      colors: {
        success: 'blue',
        info: 'bgGreen',
        warning: 'cyan',
        error: 'bgRed',
      },
    },

    /**
     * PhantomJs Launcher options
     *
     * see: https://www.npmjs.com/package/karma-phantomjs-launcher
     */
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true,
      //flags: ['--load-images=true', 'remote-debugger-port=9000', '--remote-debugger-autorun=no'],
    },

    /**
     * PhantomJs Launcher options
     *
     * see: https://www.npmjs.com/package/karma-chrome-launcher
     */
    chromeLaunchers: {
      //flags: ['--remote-debugging-port=9000'],
    },

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [
      { pattern: './spec.bundle.js', watched: false },
    ],

    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: {
      './spec.bundle.js': ['coverage', 'webpack', 'sourcemap'],
    },

    coverageReporter: {
      dir: config.root(config.data.dest.coverage),
      reporters: [
        { type: 'text-summary' },
        { type: 'json' },
        { type: 'html' },
      ],
    },

    // Webpack please don't spam the console when running in karma!
    webpackServer: {
      quiet: false,
      noInfo: true,
      stats: { chunks: false },
      progress: false,
      debug: false,
    },

    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
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
