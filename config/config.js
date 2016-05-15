/*eslint max-len: 0*/
/*eslint prefer-rest-params: 0*/

import util from 'util';

/**
 * @author: FEi
 */
import console from 'console';
import path from 'path';
import yargs from 'yargs';

//config
const data = {
  //relative to root
  dir: {
    src: 'src',
    generator: 'generator',
    config: 'config',
    assets: 'src/assets',
    data: 'src/data',
    common: 'src/common',
    bundles: 'src/bundles',
  },
  file: {
    index: 'src/index.html',
  },
  dest: {
    prod: 'dest',
    dev: 'dest.dev',
    test: 'dest.test',
    coverage: 'dest.test/coverage',
  },
  env: {
    prod: 'production',
    dev: 'development',
    test: 'test',
  },
  build: {
    release: 'release',
    debug: 'debug',
    test: 'test',
  },
  dev: {
    host: 'localhost',
    port: 3000,
  },
  test: {
    port: 3666,
  },
};
exports.data = data;

const env = {
  ENV: data.env.prod,
  BUILD: data.build.release,
  WATCH: false, //is true when 'continues' testing/development is running
};
exports.env = env;

// Helper functions
const rootPath = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [rootPath].concat(args));
}
exports.root = root;
console.log('Root directory:', root());

function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}
exports.rootNode = rootNode;

function rootGenerator(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, [data.dir.generator].concat(args));
}
exports.rootGenerator = rootGenerator;

function rootConfig(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, [data.dir.config].concat(args));
}
exports.rootConfig = rootConfig;

function rootSrc(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, [data.dir.src].concat(args));
}
exports.rootSrc = rootSrc;

function rootAssets(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, rootSrc(data.dir.assets), args);
}
exports.rootAssets = rootAssets;

function getProcessingFlag(paramName) {
  if (paramName in yargs.args) {
    return yargs.argv[paramName] || '';
  }
  return undefined;
}
exports.getProcessingFlag = getProcessingFlag;

function prependExt(extensions, args) {
  args = args || [];
  if (!Array.isArray(args)) { args = [args]; }
  return extensions.reduce((memo, val) => {
    return memo.concat(val, args.map((prefix) => {
      return prefix + val;
    }));
  }, ['']);
}
exports.prependExt = prependExt;

function debugInspectAndExit(obj) {
  console.log(util.inspect(obj, { colors: true, depth: 10, showHidden: false }));
  process.exit(1);
}
exports.debugInspectAndExit = debugInspectAndExit;

/*
* Adjust environemnt. Application will have access to env through 'process.env'
*/
exports.setEnvProdRelease = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = data.env.prod; env.BUILD = data.build.release; };
exports.setEnvProdDebug = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = data.env.prod; env.BUILD = data.build.debug; };
exports.setEnvDev = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'development'; env.BUILD = 'debug'; env.WATCH = false; };
exports.setEnvDevWatch = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'development'; env.WATCH = true; };
exports.setEnvTest = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'test'; env.BUILD = 'test'; env.WATCH = false; };
exports.setEnvTestWatch = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'test'; env.BUILD = 'test'; env.WATCH = true; };

exports.isEnvProd = () => { return env.ENV === data.env.prod; };
exports.isEnvDev = () => { return env.ENV === data.env.dev; };
exports.isEnvTest = () => { return env.ENV === data.env.test; };
exports.isBuildRelease = () => { return env.BUILD === data.build.release; };
exports.isBuildDebug = () => { return env.BUILD === data.build.debug; };
exports.isBuildTest = () => { return env.BUILD === data.build.test; };
exports.isWatched = () => { return env.WATCH === true; };

