/*eslint max-len: 0*/
/*eslint prefer-rest-params: 0*/

import util from 'util';

/**
 * @author: FEi
 */
const console = require('console');
const path = require('path');
const yargs = require('yargs');

const rootPath = path.resolve(__dirname, '..');

//config
const config = {
};

const env = {
  ENV: 'production', //vs development, test
  BUILD: 'release',  //vs debug, test
};

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [rootPath].concat(args));
}
console.log('Root directory:', root());

function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}

function rootGenerator(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, ['generator'].concat(args));
}

function rootSrc(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, ['src'].concat(args));
}

function rootAssets(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, rootSrc('assets'), args);
}

function getProcessingFlag(paramName) {
  if (paramName in yargs.args) {
    return yargs.argv[paramName] || '';
  }
  return undefined;
}

function prependExt(extensions, args) {
  args = args || [];
  if (!Array.isArray(args)) { args = [args]; }
  return extensions.reduce((memo, val) => {
    return memo.concat(val, args.map((prefix) => {
      return prefix + val;
    }));
  }, ['']);
}

function debugInspectAndExit(obj) {
  console.log(util.inspect(obj, { colors: true, depth: 10, showHidden: false }));
  process.exit(1);
}

/*
* Adjust environemnt. Application will have access to env through 'process.env'
*/
exports.setEnvProd = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'production'; };
exports.setBuildRelease = () => { env.BUILD = 'release'; };
exports.setBuildDebug = () => { env.BUILD = 'debug'; };

exports.setEnvDev = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'development'; env.BUILD = 'debug'; };
exports.setEnvTest = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'test'; env.BUILD = 'test'; };

exports.isEnvProd = () => { return env.ENV === 'production'; };
exports.isEnvDev = () => { return env.ENV === 'development'; };
exports.isEnvTest = () => { return env.ENV === 'test'; };
exports.isBuildRelease = () => { return env.BUILD === 'release'; };
exports.isBuildDebug = () => { return env.BUILD === 'debug'; };

exports.root = root;
exports.rootNode = rootNode;
exports.rootGenerator = rootGenerator;
exports.rootSrc = rootSrc;
exports.rootAssets = rootAssets;
exports.getProcessingFlag = getProcessingFlag;
exports.prependExt = prependExt;
exports.debugInspectAndExit = debugInspectAndExit;
exports.config = config;
exports.env = env;
