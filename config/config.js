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
  .alias('r', 'root')
  .argv;

/*
* Build system configuration
*/
const src = 'src';
const node = 'node_modules';
const generator = 'generator';
const bundles = 'bundles';
const common = 'common';
const assets = 'AppContent';
const mockServer = 'mock.server';
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
    mockServer,
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
  publish: {
    root: '../ngWebpackMvc4/ngWebpackMvc4', //relative to root or absolute path
    //relative to publish root
    content: assets,
    styles: assets,
    scripts: 'AppScripts',
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
    defaultBackendServerUrl: 'http://localhost:19010/webapp',
  },
  test: {
    port: 3666,
  },
  entryMap: {
    'DEFINED BELOW!': 1,
  },
  currentDest: '< one of the data.dest, determined based on env>',
  nameList: '<list of all --name param values without processing>',
};
exports.data = data;

data.dev.url = 'http://' + data.dev.host + ':' + data.dev.port;

const env = {
  ENV: data.env.prod,
  BUILD: data.build.release,
  ONLY_BUNDLE: '<flag, is set to true if only one bundle (common is not counted) is specified>',
  BUNDLES: '<explicetly specified (by --name param) list of bundles>',
  APP_BUNDLES: '<all resolved bundles excluding common>',
  APP_BUNDLE_MODULES: '<list of app bundles ng module names>',
  CONST_ENV_TEST: data.env.test,
  CONST_ENV_PROD: data.env.prod,
  CONST_ENV_DEV: data.env.dev,
  BACKEND_SERVER_URL: '', //url that all http requests will be sent to. keep it empty to serve data from mock.server
  MOCK_SERVER_DIR: data.dir.mockServer,
};
exports.env = env;

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

function inspect(...args) {
  args.forEach((o) => {
    console.log(util.inspect(o, { colors: true, depth: 10, showHidden: false }));
  });
}
exports.inspect = inspect;

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

let currentPulishingRoot = data.publish.root;
function rootPublish(args) {
  args = Array.prototype.slice.call(arguments, 0);
  let dir = path.resolve('', currentPulishingRoot);
  if (!dirExists(dir)) {
    dir = root(currentPulishingRoot);
    if (!dirExists(dir)) {
      warn('Unable to resolve path "' + currentPulishingRoot + '"');
      error('Publishing root directory must exist');
    }
  }
  const ret = path.join.apply(path, [dir].concat(args));
  return ret;
}
exports.rootPublish = rootPublish;

function setPublishingRootFromOrDefault(cmdParamName) {
  const r = getProcessingFlag(cmdParamName);
  if (r !== undefined) {
    currentPulishingRoot = data.dev.defaultBackendServerUrl;
    if (r.length) {
      currentPulishingRoot = r;
    }
  }
  info('Publishing root: ' + currentPulishingRoot);
  return currentPulishingRoot;
}
exports.setPublishingRootFromOrDefault = setPublishingRootFromOrDefault;

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

function splitName(val) {
  let s = val.replace(/([A-Z]+[0-9]?)(?=[A-Z\.\-\\]|$)/g, (x) => { //AAABcTestDDD => _aaa_BcTest_ddd_
    return '_' + x + '_';
  });
  s = s.replace(/([A-Z])/g, (x) => '_' + x); //_aaa_BcTest_ddd_ => _aaa__Bc_Test_ddd_
  s = s.replace(/^_+/, '').replace(/_+$/, '').replace(/[_\-]+/g, '_'); //_aaa__Bc_Test_ddd_ => aaa_Bc_Test_ddd
  s = s.split('_');
  return s;
}
exports.splitName = splitName;

const camelCase = 1;
exports.camelCase = camelCase; //first work lower case and the rest are capCase
const camelCapCase = 2;
exports.camelCapCase = camelCapCase; //fist letter of each word is capitalized
const lowerCase = 3;
exports.lowerCase = lowerCase; //all letters in lower case
const upperCase = 4; //ALL CAP
exports.upperCase = upperCase;

function nameToChunks(name, caseType, dropSuffix) {
  if (!name) {
    return [];
  }
  const lst = splitName(name);
  const ret = lst.map((v, idx) => {
    if (caseType === camelCase) {
      if (idx === 0) {
        v = firstCharToLowerCase(v);
      } else {
        v = firstCharToUpperCase(v);
      }
    } else if (caseType === camelCapCase) {
      v = firstCharToUpperCase(v);
    } else if (caseType === lowerCase) {
      v = v.toLowerCase();
    } else if (caseType === upperCase) {
      v = v.toUpperCase();
    } else if (caseType === undefined) {
      return v;
    } else {
      error('nameToChunks(): invalid case type: ' + caseType);
    }
    return v;
  });

  if (dropSuffix) {
    let last = ret.pop();
    last = last.replace(/(service|directive|component|interceptor|controller|filter|module|bundle)$/i, '');
    if (last.length) {
      ret.push(last);
    }
  }

  return ret;
}
exports.nameToChunks = nameToChunks;

function setBackendServerUrlFromOrDefault(cmdParamName) {
  const srv = getProcessingFlag(cmdParamName);
  if (srv !== undefined) {
    env.BACKEND_SERVER_URL = data.dev.defaultBackendServerUrl;
    if (srv.length) {
      env.BACKEND_SERVER_URL = srv;
    }
    info('Backend server: ' + env.BACKEND_SERVER_URL);
  } else {
    info('Backend server: MOCK SERVER');
  }
  return env.BACKEND_SERVER_URL;
}
exports.setBackendServerUrlFromOrDefault = setBackendServerUrlFromOrDefault;

/*
* Process command line parameters and create halping data sets
*/
const names = [].concat(getProcessingFlag('name') || []);
data.nameList = names;

//all explicetly listed bundle dir names converted according to fileName convention.
const listedBundleNames = names
  .map((v) => nameToChunks(v, lowerCase).join('-'))
  .filter((v) => dirExists(rootSrc(bundles, v)) || v.toLowerCase() === 'common');
env.BUNDLES = listedBundleNames;

let nonCommonBundleCount = 0;
const masterBundle = listedBundleNames.reduce((prev, v) => {
  if (v.toLowerCase() === common) {
    return prev;
  }
  nonCommonBundleCount++;
  return (!!prev) ? prev : v;
}, '');
//is only bundle?
env.ONLY_BUNDLE = nonCommonBundleCount === 1;

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
  let indexFileSuffix = '';
  let key;
  let isCommon = false;
  if (d.indexOf(common) === 0 && lst.length === 1) {
    indexFileSuffix = d + '/index';
    fileSuffix = d + '/' + d;
    isCommon = true;
    key = common;
    ret = true;
  } else if (d.indexOf(bundles) === 0 && lst.length === 2) {
    if (!listedBundleNames.length || listedBundleNames.indexOf(lst[1]) >= 0) {
      indexFileSuffix = d + '/index';
      fileSuffix = d + '/' + lst[1];
      key = nameToChunks(lst[1], camelCase).join('');
      ret = true;
    }
  }
  if (ret) {
    const extList = ['.js', '.ts'];

    const possibleEntryFiles = extList.reduce((prev, ext) => {
      if (fileExists(rootSrc(fileSuffix + ext))) {
        prev.push(fileSuffix + ext);
      } else if (fileExists(rootSrc(indexFileSuffix + ext))) {
        prev.push(indexFileSuffix + ext);
      }
      return prev;
    }, []);
    if (possibleEntryFiles.length > 1) {
      error('Multiple entries: ' + d);
    }

    if (![possibleEntryFiles].length) {
      ret = false;
    } else {
      entryMap[key] = { script: possibleEntryFiles[0], html: fileSuffix + '.html', isCommon };
    }
  }
  return ret;
});
data.entryMap = entryMap;

env.APP_BUNDLES = Object.keys(entryMap).filter((v) => v !== common);
if (env.APP_BUNDLES.length === 1) {
  env.ONLY_BUNDLE = true;
}
env.APP_BUNDLE_MODULES = env.APP_BUNDLES.map((v) => {
  return nameToChunks(v, camelCase, false).join('');
});

//debugInspectAndExit(dirMap);
//debugInspectAndExit(srcDirs);
//debugInspectAndExit(entryMap);
//debugInspectAndExit(env);

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


