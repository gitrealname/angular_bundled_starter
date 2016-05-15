/*eslint no-undef:0*/
/*eslint prefer-template: 0*/
/*eslint max-len: 0*/
/**
 * @author: FEi
 */

require('ts-node/register');
const config = require('./config');

exports.config = {
  baseUrl: 'http://' + config.data.dev.host + ':' + config.data.dev.port + '/',

  // use `npm run e2e`
  specs: [
    config.root(config.data.dir.src + '/**/**.e2e.ts'),
    config.root(config.data.dir.src + '/**/*.e2e.ts'),
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000,
  },
  directConnect: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['show-fps-counter=true'],
    },
  },

  onPrepare: () => {
    browser.ignoreSynchronization = true;
  },

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps
   * on the page instead of just the one matching `rootEl`
   */
  useAllAngular2AppRoots: true,
};
