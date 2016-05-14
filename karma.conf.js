/**
 * @author: @AngularClass
 */
require('babel-core').transform('code', {
  presets: ['es2015'],
});

// Look in ./config for karma.conf.js
module.exports = require('./config/karma.conf.js');
