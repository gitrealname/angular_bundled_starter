/*eslint max-len: 0*/
/*eslint prefer-rest-params: 0*/
/*eslint prefer-template: 0*/

import util from 'util';

/**
 * @author: FEi
 */
import console from 'console';
import path from 'path';
import glob from 'glob';
import fs from 'fs';
import gutil from 'gulp-util';
import colors from 'colors';
const argv = require('yargs')
  .alias('p', 'parent')
  .alias('n', 'name')
  .argv;

function debugInspectAndExit(...args) {
  args.forEach((o) => {
    console.log(util.inspect(o, { colors: true, depth: 10, showHidden: false }));
  });
  //console.log(util.inspect(obj, { colors: true, depth: 10, showHidden: false }));
  process.exit(1);
}
exports.debugInspectAndExit = debugInspectAndExit;
//debugInspectAndExit(argv);

//config
const data = {
  //relative to root
  dir: {
    //relative to root
    src: 'src',
    generator: 'generator',
    config: 'config',
    //relative to src
    assets: 'assets',
    data: 'data',
    common: 'common',
    bundles: 'bundles',
  },
  file: {
    index: 'src/index.html',
  },
  dest: {
    prod: 'dest',
    dev: 'dest.dev',
    test: 'dest.test',
    coverage: 'DEFINED BELOW!',
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
    url: 'DEFINED BELOW!',
  },
  test: {
    port: 3666,
  },
  entryMap: {
    'DEFINED BELOW!': 1,
  },
  nameList: ['DEFINED BELOW'], //list of names provided in command line by --name
};
data.dest.coverage = data.dest.test + '/coverage';
data.dev.url = 'http://' + data.dev.host + ':' + data.dev.port;
exports.data = data;

const env = {
  ENV: data.env.prod,
  BUILD: data.build.release,
  WATCH: false, //is true when 'continues' testing/development is running
  NAMES: ['DEFINED BELOW'], //list of --name param values
};
exports.env = env;

// Helper functions
function error(...arg) {
  console.log(colors.red('ERROR: ' + arg.join(' ')));
  gutil.beep();
  process.exit(1);
}
exports.error = error;

function info(...arg) {
  console.log(colors.bold.green(arg.join(' ')));
}
exports.info = info;

function warn(...arg) {
  console.log(colors.bold.yellow('WARNING: ' + arg.join(' ')));
}
exports.warn = warn;


const rootPath = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [rootPath].concat(args));
}
exports.root = root;
info('Root directory: ', root());

function rootSrc(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, [data.dir.src].concat(args));
}
exports.rootSrc = rootSrc;

function getProcessingFlag(paramName) {
  if (paramName === undefined) {
    return argv._;
  }
  if (paramName in argv) {
    return argv[paramName] || '';
  }
  return undefined;
}
exports.getProcessingFlag = getProcessingFlag;

const names = getProcessingFlag('name') || [];
data.nameList = [].concat(names);
env.NAMES = data.nameList;

/*
* Process command line parameters and create halping data sets
*/
if (!!argv._ && argv._.length > 1) {
  argv.name = argv._[1]; //[0] - gulp command
}
const srcDirs = glob.sync(root(data.dir.src, '**'), { })
  .filter((f) => {
    return fs.lstatSync(f).isDirectory();
  }).map((d) => {
    return d.substring(rootSrc().length + 1);
  });
const dirMap = {};
srcDirs.forEach((d) => {
  const lcPath = d.toLowerCase();
  dirMap[lcPath] = d;
});
const entryDirs = srcDirs.filter((d) => {
  const lst = d.split('/');
  let ret = undefined;
  if (d.indexOf(data.dir.common) === 0 && lst.length === 1) {
    ret = true;
  } else if (d.indexOf(data.dir.bundles) === 0 && lst.length === 2) {
    if (!data.nameList.length || names.indexOf(lst[1]) >= 0) {
      ret = true;
    }
  }
  return ret;
});
const entryMap = entryDirs.map((d) => {
  const lst = d.split('/');
  const bundle = lst.pop();
  //Todo: handle .ts files!!!
  const h = {
    bundle,
    file: bundle + '/' + bundle + '.js',
    isCommon: false,
  };
  if (h.bundle === data.dir.common) {
    h.isCommon = true;
  } else {
    h.file = data.dir.bundles + '/' + h.file;
  }
  return h;
});
data.entryMap = entryMap;
//debugInspectAndExit(srcDirs);
//debugInspectAndExit(entryDirs);
//debugInspectAndExit(entryMap);
//debugInspectAndExit(dirMap);

function fileExists(fileName) {
  try {
    const stats = fs.lstatSync(fileName);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}
exports.fileExists = fileExists;

function dirExists(dirName) {
  try {
    const stats = fs.lstatSync(dirName);
    return stats.isDirectory();
  } catch (e) {
    return false;
  }
}
exports.dirExists = dirExists;

function toPascalCase(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}
exports.toPascalCase = toPascalCase;

function toCamelCase(val) {
  return val.charAt(0).toLowerCase() + val.slice(1);
}
exports.toCamelCase = toCamelCase;

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

function rootAssets(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return rootSrc.apply(path, [data.dir.assets].concat(args));
}
exports.rootAssets = rootAssets;

/*
* Adjust environemnt. Application will have access to env through 'process.env'
*/
exports.setEnvProdRelease = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = data.env.prod; env.BUILD = data.build.release; };
exports.setEnvProdDebug = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = data.env.prod; env.BUILD = data.build.debug; };
exports.setEnvDev = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'development'; env.BUILD = 'debug'; env.WATCH = true; };
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

