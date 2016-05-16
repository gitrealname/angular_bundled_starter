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
};
data.dest.coverage = data.dest.test + '/coverage';
data.dev.url = 'http://' + data.dev.host + ':' + data.dev.port;
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

/*
* Process command line parameters and create halping data sets
*/
if (!!argv._ && argv._.length > 1) {
  argv.name = argv._[1]; //[0] - gulp command
}
const srcDirs = glob.sync(root('src', '**'), { })
  .filter((f) => {
    return fs.statSync(f).isDirectory();
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
    const bundleName = getProcessingFlag('name');
    if (bundleName === undefined || lst[1] === bundleName) {
      ret = true;
    }
  }
  return ret;
});
const entryMap = entryDirs.map((d) => {
  const lst = d.split('/');
  const bundle = lst.pop();
  //Todo: handle .ts files!!!
  const h = { bundle,
    file: bundle + '/' + bundle + '.js',
  };
  return h;
});
data.entryMap = entryMap;
//debugInspectAndExit(srcDirs);
//debugInspectAndExit(entryDirs);
//debugInspectAndExit(entryMap);
//debugInspectAndExit(dirMap);

function err(message) {
  console.error(message);
  process.exit(1);
}

function toPascalCase(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}
exports.toPascalCase = toPascalCase;

function toCamelCase(val) {
  return val.charAt(0).toLowerCase() + val.slice(1);
}
exports.toCamelCase = toCamelCase;

function createGeneratorTemplateParams(dir, isBundle = false) {
  let parent = getProcessingFlag('parent');
  if (isBundle) {
    parent = data.dir.bundles;
  }
  let name = getProcessingFlag('name');
  if (!parent || !name) {
    err('Inavlid parameters');
  }
  const lcName = name.toLowerCase();
  //don't allow '-' in the name
  if (name.split('-').length > 1) {
    err('Name must not contain "-"');
  }
  name = name.replace(/\/$/, '').replace(/^\//, '');
  parent = parent.replace(/\/$/, '').replace(/^\//, '');
  parent = parent.toLowerCase().split('\\').join('/');
  const parentChunks = parent.split('/');
  //if parent doesn't contain 'common' or 'bundles' -> assume bundles
  if (parentChunks[0] !== data.dir.common && parentChunks[0] !== data.dir.bundles) {
    parentChunks.unshift(data.dir.bundles);
    parent = data.dir.bundles + '/' + parent;
  }
  //bundle module must be under named bundle
  if (!isBundle && parentChunks[0] !== data.dir.common && parentChunks.length === 1) {
    err('Invalid location: ' + parent + '; specify full parent path (e.g bundles/test;  common)');
  }
  //parent must be within src dir map
  if (!dirMap[parent] || (parentChunks[0] !== data.dir.common && parentChunks[0] !== data.dir.bundles)) {
    err('Invalid parent: ' + parent);
  }
  //module with this name already exists
  const fullName = parent + '/' + lcName;
  if (dirMap[fullName]) {
    err('Module already exists: ' + name);
  }
  //compile
  if (isBundle) {
    dir = '';
  } else {
    dir = dir + '/';
  }
  const destPath = parent + '/' + dir + lcName;
  const isCommon = parentChunks[0] === data.dir.common;
  if (!isCommon) {
    //remove 'bundles' from the list
    parentChunks.shift();
  }
  const result = {
    name,
    lcName,
    cName: toCamelCase(name),
    pName: toPascalCase(name),
    dotName: parentChunks.join('.') + '.' + lcName,
    dushName: parentChunks.join('-') + '-' + lcName,
    destPath,
  };

  debugInspectAndExit(result);
  return result;
}
exports.createGeneratorTemplateParams = createGeneratorTemplateParams;

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

