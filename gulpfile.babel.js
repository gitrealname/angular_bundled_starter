require('babel-core').transform('code', {
  presets: ['es2015'],
});
import 'babel-polyfill';
module.exports.entry = ['babel-polyfill', '..'];

/* Full config of gulp task located in ./config/gulp/*.js */
import requiredir from 'require-dir';

requiredir('./config/gulp', { recurse: true });
