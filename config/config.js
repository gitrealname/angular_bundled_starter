/**
 * @author: FEi
 */
/*eslint max-len: 0*/
/*eslint prefer-rest-params: 0*/
/*eslint prefer-template: 0*/

import util from 'util';

/*
* Naming case variations terminology
* See: https://en.wikipedia.org/wiki/Letter_case#Special_case_styles
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
  .alias('f', 'force')
  .alias('o', 'open')
  .alias('s', 'server')
  .argv;

/*
* Build system configuration
*/
const src = 'src';
const node = 'node_modules';
const generator = 'generator';
const bundles = 'bundles';
const common = 'common';
const assets = 'Content';
const devData = 'dev.server.data';
const config = 'config';

const data = {
  //relative to root
  dir: {
    //relative to root
    src,
    node,
    generator,
    config,
    //relative to src
    assets,
    devData,
    common,
    bundles,
  },
  file: {
    index: 'index.html',
  },
  dest: {
    prod: 'prod.dest',
    dev: '',
    test: '',
    coverage: 'test.coverage',
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
    requestServerHost: 'http://localhost',
    requestServerPort: '19010',
    requestServerRoot: '/webapp',
  },
  test: {
    port: 3666,
  },
  entryMap: {
    'DEFINED BELOW!': 1,
  },
  currentDest: '< one of the data.dest, determined based on env>',
};
exports.data = data;

const env = {
  ENV: data.env.prod,
  BUILD: data.build.release,
  WATCH: false, //is true when 'continues' testing/development is running
  ONLY_BUNDLE: '<flag, is set to true if only one bundle (common is not counted) is specified>',
  BUNDLES: '<explicetly specified (by --name param) list of bundles>',
  BUNDLE_ENTRIES: '<all resolved bundles excluding common>',
  PORT: '<server port>',
  CONST: {
    TEST_ENV: data.env.test,
    PROD_ENV: data.env.prod,
    DEV_ENV: data.env.dev,
  },
};
exports.env = env;

data.dev.url = 'http://' + data.dev.host + ':' + data.dev.port;
env.PORT = data.dev.port;

/*
* Helper functions
*/
function debugInspectAndExit(...args) {
  args.forEach((o) => {
    console.log(util.inspect(o, { colors: true, depth: 10, showHidden: false }));
  });
  process.exit(1);
}
exports.debugInspectAndExit = debugInspectAndExit;
//debugInspectAndExit(argv);

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
  return root.apply(path, [src].concat(args));
}
exports.rootSrc = rootSrc;

function getProcessingFlag(paramName) {
  if (paramName === undefined) {
    return argv._;
  }
  if (paramName in argv) {
    return argv[paramName] || undefined;
  }
  return undefined;
}
exports.getProcessingFlag = getProcessingFlag;

function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, [node].concat(args));
}
exports.rootNode = rootNode;

function rootGenerator(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, [generator].concat(args));
}
exports.rootGenerator = rootGenerator;

function rootConfig(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, [config].concat(args));
}
exports.rootConfig = rootConfig;

function rootAssets(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return rootSrc.apply(path, [assets].concat(args));
}
exports.rootAssets = rootAssets;

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

//string convertion functions
function firstCharToUpperCase(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}
exports.firstCharToUpperCase = firstCharToUpperCase;

function firstCharToLowerCase(val) {
  return val.charAt(0).toLowerCase() + val.slice(1);
}
exports.firstCharToLowerCase = firstCharToLowerCase;

function dushedNameToChunks(val) {
  const s = val.split('-');
  return s;
}
exports.dushedNameToChunks = dushedNameToChunks;

function camelCaseNameToLowerCaseChunks(val) {
  let s = val.replace(/([A-Z]+[0-9]?)(?=[A-Z\.\-]|$)/g, (x) => { //AAABcTestDDD => _aaa_BcTest_ddd_
    return '_' + x.toLowerCase() + '_';
  });
  s = s.replace(/([A-Z])/g, (x) => '_' + x.toLowerCase()); //_aaa_BcTest_ddd_ => _aaa__bc_test_ddd_
  s = s.replace(/^_+/, '').replace(/_+$/, '').replace(/_+/g, '_'); //_aaa__bc_test_ddd_ => aaa_bc_test_ddd
  s = s.split('_');
  return s;
}
exports.camelCaseNameToLowerCaseChunks = camelCaseNameToLowerCaseChunks;

const camelCase = 1;
exports.camelCase = camelCase; //first work lower case and the rest are capCase
const capCase = 2;
exports.capCase = capCase; //fist letter of each word is capitalized
const lowerCase = 3;
exports.lowerCase = lowerCase; //all letters in lower case

function looseNameToXCase(val, caseType, dropSuffix = true) {
  val = val.replace('.', '-');
  val = dushedNameToChunks(val);
  val = val.map((v) => firstCharToUpperCase(v));
  if (dropSuffix) {
    let last = val.pop();
    last = last.replace(/(service|directive|component|interceptor|controller|filter)$/i, '');
    if (last.length) {
      val.push(last);
    }
  }
  let str = val.join('');
  if (caseType === camelCase) {
    str = firstCharToLowerCase(str);
  } else if (caseType === lowerCase) {
    str = str.toLowerCase();
  }
  return str;
}
exports.looseNameToXCase = looseNameToXCase;

/*
* Process command line parameters and create halping data sets
*/
const names = [].concat(getProcessingFlag('name') || []);
//--name xyz-special-service --name TestAbout => [xyzSpecialService, testAbout]
const formalNames = names.map((n) => looseNameToXCase(n, camelCase, false));
//--name aa-bb --name AbCd --name xyzAbcService => [aaBb, abCd, xyzAbc]
const camelCaseNormalizedNames = names.map((n) => looseNameToXCase(n, camelCase));
//--name aa-bb --name ABCd --name xyzABCService => [aa-bb, ab-cd, xyz-abc]
const fileNames = camelCaseNormalizedNames.map((v) => camelCaseNameToLowerCaseChunks(v).join('-'));

//all explicetly listed bundle dir names converted according to fileName convention.
const explicitBundleDirNames = fileNames.filter((v) => dirExists(rootSrc(bundles, v)) || v.toLowerCase() === 'common');
env.BUNDLES = explicitBundleDirNames;

let nonCommonBundleCount = 0;
let masterBundleCamelCaseNormalizedName = explicitBundleDirNames.reduce((prev, v) => {
  if (v.toLowerCase() === common) {
    return prev;
  }
  nonCommonBundleCount++;
  return (!!prev) ? prev : v;
}, '');
masterBundleCamelCaseNormalizedName = looseNameToXCase(masterBundleCamelCaseNormalizedName, camelCase);
//is only bundle?
env.ONLY_BUNDLE = nonCommonBundleCount === 1;

//prepare additional constants for generator
const parents = [].concat(getProcessingFlag('parent') || []);
const parentChunks = parents.length ? parents[0].split(/[\/\\]+/) : [];
const parentDirNameChunks = parentChunks.map((v) => camelCaseNameToLowerCaseChunks(looseNameToXCase(v, camelCase)).join('-'));
const parentDirNameChunksReduced = parentDirNameChunks.filter((v) => v !== 'components' && v !== bundles);

/*
* Prepare webpack Entry map
*/

//get all dirs (relative to 'src' directory)
const srcDirs = glob.sync(rootSrc('**'), { })
  .filter((f) => {
    return fs.lstatSync(f).isDirectory();
  }).map((d) => {
    return d.substring(rootSrc().length + 1);
  });

//create entry map: common always included, the rest is determined by --name param
//and existance of the entry file (.js or .ts)
const entryMap = {}; //{<key> => {file: <entry_file>}}
srcDirs.filter((d) => {
  const lst = d.split('/');
  let ret = false;
  let fileSuffix = '';
  let key;
  let isCommon = false;
  if (d.indexOf(common) === 0 && lst.length === 1) {
    fileSuffix = d + '/' + d;
    isCommon = true;
    key = common;
    ret = true;
  } else if (d.indexOf(bundles) === 0 && lst.length === 2) {
    if (!fileNames.length || fileNames.indexOf(lst[1]) >= 0) {
      fileSuffix = d + '/' + lst[1];
      key = looseNameToXCase(lst[1], camelCase);
      ret = true;
    }
  }
  if (ret) {
    const extList = ['.js', '.ts'];
    const entryExt = extList.filter((v) => fileExists(rootSrc(fileSuffix + v)));
    if (!entryExt.length) {
      ret = false;
    } else {
      entryMap[key] = { script: fileSuffix + entryExt[0], html: fileSuffix + '.html', isCommon };
    }
  }
  return ret;
});
data.entryMap = entryMap;

env.BUNDLE_ENTRIES = Object.keys(entryMap).filter((v) => v !== common);

//debugInspectAndExit(dirMap);
//debugInspectAndExit(srcDirs);
//debugInspectAndExit(entryMap);

function pathDiffToRelativePath(srcPath, destPath) {
  srcPath = path.resolve(srcPath);
  destPath = path.resolve(destPath);
  const srcChunks = srcPath.split(/[\/\\]+/);
  const destChunks = destPath.split(/[\/\\]+/);
  const commonChunks = destChunks.reduce((prev, v, i) => {
    if (v === srcChunks[i]) {
      prev.push(v);
    }
    return prev;
  }, []);

  //compile '../' sufix
  let res = '../'.repeat(destChunks.length - commonChunks.length);
  const srcDiff = srcChunks.splice(commonChunks.length);
  res = res + srcDiff.join('/') + '/';

  //debugInspectAndExit(srcChunks, destChunks, res, srcDiff);

  return res;
}
exports.pathDiffToRelativePath = pathDiffToRelativePath;


/*
* Adjust environemnt. Application will have access to env through 'process.env'
*/
exports.setEnvProdRelease = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = data.env.prod; env.BUILD = data.build.release; data.currentDest = data.dest.prod; };
exports.setEnvProdDebug = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = data.env.prod; env.BUILD = data.build.debug; data.currentDest = data.dest.prod; };
exports.setEnvDev = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'development'; env.BUILD = 'debug'; env.WATCH = true; data.currentDest = data.dest.dev; };
exports.setEnvDevWatch = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'development'; env.WATCH = true; data.currentDest = data.dest.dev; };
exports.setEnvTest = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'test'; env.BUILD = 'test'; env.WATCH = false; data.currentDest = data.dest.test; };
exports.setEnvTestWatch = () => { process.env.NODE_ENV = process.env.ENV = env.ENV = 'test'; env.BUILD = 'test'; env.WATCH = true; data.currentDest = data.dest.test; };

exports.isEnvProd = () => { return env.ENV === data.env.prod; };
exports.isEnvDev = () => { return env.ENV === data.env.dev; };
exports.isEnvTest = () => { return env.ENV === data.env.test; };
exports.isBuildRelease = () => { return env.BUILD === data.build.release; };
exports.isBuildDebug = () => { return env.BUILD === data.build.debug; };
exports.isBuildTest = () => { return env.BUILD === data.build.test; };
exports.isWatched = () => { return env.WATCH === true; };


