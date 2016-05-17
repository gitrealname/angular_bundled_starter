/*eslint max-len: 0*/
/*eslint prefer-rest-params: 0*/
/*eslint prefer-template: 0*/

/*
* See: https://www.npmjs.com/package/gulp-help
*/
const gulp = require('gulp-help')(require('gulp'));
import rename from 'gulp-rename';
import template from 'gulp-template';

import config from '../config';

function createGeneratorTemplateParams(collectionName, targetIsDir, replaceFiles = false, isBundle = false) {
  const data = config.data;
  let parent = config.getProcessingFlag('parent');
  if (isBundle) {
    parent = data.dir.bundles;
  }
  let name = config.data.nameList[0];
  if (!parent || !name) {
    config.error('Inavlid parameters');
  }
  const lcName = name.toLowerCase();
  //don't allow '-' in the name
  if (name.split('-').length > 1) {
    config.error('Name must not contain "-"');
  }
  name = name.replace(/\/$/, '').replace(/^\//, '');
  parent = parent.replace(/\/$/, '').replace(/^\//, '');
  parent = parent.toLowerCase().split('\\').join('/');
  //split parent to chunks and remove all 'components'
  const parentChunks = parent.split('/').filter((val) => {
    return val !== 'components';
  });

  let parentDirChunks = parentChunks.slice();
  //if parent doesn't contain 'common' or 'bundles' -> assume bundles
  if (parentDirChunks[0] !== data.dir.common && parentDirChunks[0] !== data.dir.bundles) {
    parentDirChunks.unshift(data.dir.bundles);
  } else {
    //remove 'bundles'/'common' string from parentChunks
    parentChunks.shift();
  }

  //inject missing 'commponents' into parent dir chunks
  if (parentDirChunks[0] === data.dir.common) {
    //temporary adjust array length, so that it matches expected structure
    parentDirChunks.unshift(0);
  }

  const lst = [];
  for (let i = 0; i < parentDirChunks.length; i++) {
    if (i > 1 && (i % 2 === 0)) {
      lst.push('components');
    }
    if (i > 0 || !!parentDirChunks[i]) {
      lst.push(parentDirChunks[i]);
    }
  }
  parentDirChunks = lst;
  const parentDir = parentDirChunks.join('/');
  //calculate full module path
  const destDir = parentDir + ((collectionName) ? '/' + collectionName : '') + ((targetIsDir) ? '/' + lcName : '');

  //parent must be within src dir map
  if (!config.dirExists(config.rootSrc(parentDir))) {
    config.error('Calculated parent directionry must exist: ' + parentDir);
  }
  //when target is a directory we can also check if it exists
  if (!replaceFiles && targetIsDir && config.dirExists(config.rootSrc(destDir))) {
    config.error('Module already exists: ' + destDir);
  }


  //compile
  const result = {
    name: lcName,
    lcName,
    cName: config.toCamelCase(name),
    pName: config.toPascalCase(name),
    cFullName: 'SEE BELOW',
    dotedFullName: parentChunks.concat(lcName).join('.'),
    dotedPascalFullName: parentChunks.concat(lcName).map((val) => config.toPascalCase(val)).join('.'),
    dushedFullName: parentChunks.concat(lcName).join('-'),
    destDir,
    parentDir,
    bundleRelativeRoot: './', //see below
    bundleName: lcName, //see below
  };
  if (!isBundle) {
    result.bundleName = parentChunks[0];
    const len = result.dotedFullName.split('.').length + (targetIsDir ? 0 : 1);
    result.bundleRelativeRoot = '../'.repeat(len);
  }

  //calculate full name in camel case
  result.cFullName = parentChunks
    .concat(result.lcName)
    .map((val, idx) => { return (idx === 0) ? config.toCamelCase(val) : config.toPascalCase(val); })
    .join('');

  return result;
}
exports.createGeneratorTemplateParams = createGeneratorTemplateParams;

function generate(generatorType, collectionName, targetIsDir, replaceFiles, isBundle = false) {
  if (config.getProcessingFlag('force') !== undefined) {
    replaceFiles = true;
  }
  const tmpl = createGeneratorTemplateParams(collectionName, targetIsDir, replaceFiles, isBundle);

  //config.debugInspectAndExit(tmpl);

  const destPath = config.rootSrc(tmpl.destDir);
  return gulp.src(config.rootGenerator(generatorType + '/**/*.**'))
    .pipe(template(tmpl))
    .pipe(rename((p) => {
      p.basename = p.basename.replace('temp', tmpl.lcName);
    }))
    .pipe(gulp.dest(destPath));
}

gulp.task('generate:bundle', ['generate:component'], () => {
  return generate('bundle', undefined, true, true, true);
});

gulp.task('generate:component', () => {
  return generate('component', 'components', true, false, false);
});

gulp.task('generate:service', () => {
  return generate('service', 'services', false, false, false);
});

gulp.task('generate:directive', () => {
  config.error('Directive generation is not yet implemented');
  //return generate('directive', 'directives', true, false, false);
});
