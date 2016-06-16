require('babel-core').transform('code');

/* Full config of gulp task located in ./config/gulp/*.js */
import requiredir from 'require-dir';

requiredir('./config/gulp', { recurse: true });
