/*eslint max-len: 0*/
/*eslint prefer-rest-params: 0*/
/*eslint prefer-template: 0*/

/*
* See: https://www.npmjs.com/package/gulp-help
*/
const gulp = require('gulp-help')(require('gulp'));
import rename from 'gulp-rename';
import template from 'gulp-template';
import readline from 'readline-sync';

import config from '../config';

function createGeneratorTemplateParams(componentType) {
  const data = config.data;
  componentType = componentType.toLowerCase();
  const tmpl = {
    camelName: 'myComponentABCSpecial', //suffix is dropped
    camelCapName: 'MyComponentABCSpecial', //suffix is dropped
    lispName: 'my-component-abc-special', //suffix is dropped
    suffix: '<depends on componentType param', //either of Component, Service, Directive, ....

    dotedCamelCapFullName: 'Parent.AnotherParent.MyComponentABCSpecial', // no suffix
    dotedCamelFullName: 'parent.anotherParent.myComponentAbcSpecial',
    lispFullName: 'parent-another-parent-my-component-abc-special', //no suffix
    camelFullName: 'parentAnotherParentMyComponentAbcSpecial',

    destDirSuffix: '<depends on componentType param>', //either components, services, directives, bundles
    slashedLispFullDir: 'parent/another-parent/<dest-dir-suffix>/my-component',
    slashedLispParentDir: 'parent/another-parent/',

    lispBundleName: '',
    bundleRootRelativePath: './',
  };

  let parent = config.getProcessingFlag('parent') || '';
  const name = data.nameList[0];
  if ((!parent && componentType !== 'bundle') || !name) {
    config.error('Inavlid parameters', 'parent: ' + parent, 'name: ' + name);
  }

  //set names
  tmpl.camelName = config.nameToChunks(name, config.camelCase, true).join('');
  tmpl.camelCapName = config.nameToChunks(name, config.camelCapCase, true).join('');
  tmpl.lispName = config.nameToChunks(name, config.lowerCase, true).join('-');
  tmpl.suffix = componentType === 'bundle' ? '' : config.firstCharToUpperCase(componentType);
  tmpl.destDirSuffix = (componentType === 'bundle') ? '' : componentType + 's';

  //parse parent
  parent = parent.replace(/^[\\\/]+/, '');
  parent = parent.replace(/[\\\/]+$/, '');
  let parentChunks = parent.split(/[\\\/\.]+/);
  if (!parentChunks[0]) {
    parentChunks = [];
  }

  //removes intermediate 'components' and explicit ending if spcified
  const parentNameChunks = parentChunks.filter((v) => {
    return !v.match('/(components|bundles|directives|services|controllers)/');
  });
  tmpl.dotedCamelCapFullName = parentNameChunks.map((v) => {
    return config.nameToChunks(v, config.camelCapCase, true).join('');
  }).concat(tmpl.camelCapName).join('.');

  tmpl.dotedCamelFullName = parentNameChunks.map((v) => {
    return config.nameToChunks(v, config.camelCase, true).join('');
  }).concat(tmpl.camelName).join('.');

  tmpl.lispFullName = parentNameChunks.map((v) => {
    return config.nameToChunks(v, config.lowerCase, true).join('-');
  }).concat(tmpl.lispName).join('-');

  tmpl.camelFullName = parentNameChunks.map((v) => {
    return config.nameToChunks(v, config.camelCapCase, true).join('');
  }).concat(tmpl.camelCapName).join('');
  tmpl.camelFullName = config.firstCharToLowerCase(tmpl.camelFullName);

  //inject word 'components' between each parent
  let parentNameChunksWithComponents = parentNameChunks.reduce((prev, v) => {
    prev.push('components');
    prev.push(v);
    return prev;
  }, []);
  parentNameChunksWithComponents.shift(); //remove first 'component'

  //adjust path relative to src
  tmpl.lispBundleName = config.nameToChunks(parentNameChunksWithComponents[0], config.lowerCase).join('-');
  let isDestinationCommon = true;
  if (parentNameChunksWithComponents.length && parentNameChunksWithComponents[0].toLowerCase() !== data.dir.common) {
    isDestinationCommon = false;
    parentNameChunksWithComponents.unshift(data.dir.bundles);
  }
  if (componentType === 'bundle') {
    parentNameChunksWithComponents = [data.dir.bundles];
    tmpl.lispBundleName = tmpl.lispName;
  }
  tmpl.slashedLispParentDir = parentNameChunksWithComponents.map((v) => {
    return config.nameToChunks(v, config.lowerCase, true).join('-');
  }).join('/');
  tmpl.slashedLispFullDir = tmpl.slashedLispParentDir;
  if (tmpl.destDirSuffix) {
    tmpl.slashedLispFullDir += '/' + tmpl.destDirSuffix;
  }
  if (componentType === 'component' || componentType === 'directive' || componentType === 'bundle') {
    tmpl.slashedLispFullDir += '/' + tmpl.lispName;
  }
  tmpl.slashedLispFullDir = tmpl.slashedLispFullDir.replace(/[\/]+/g, '/');

  //calculate parent relative name
  const len = tmpl.slashedLispFullDir.split('/').length - (isDestinationCommon ? 1 : 2);
  if (componentType !== 'bundle') {
    tmpl.bundleRootRelativePath = '../'.repeat(len);
  }
  return tmpl;
}
exports.createGeneratorTemplateParams = createGeneratorTemplateParams;

function generate(componentType) {
  const tmpl = createGeneratorTemplateParams(componentType);
  //inspect template
  config.inspect(tmpl);
  config.info('Please review template parameters above (press Enter to continue with generation):');
  readline.question();

  //DBG
  //config.info('exiting...');
  //process.exit(1);

  //Generate
  const destPath = config.rootSrc(tmpl.slashedLispFullDir);
  return gulp.src(config.rootGenerator(componentType + '/**/*.**'))
    .pipe(template(tmpl))
    .pipe(rename((p) => {
      p.basename = p.basename.replace('temp', tmpl.lispName);
    }))
    .pipe(gulp.dest(destPath));
}

gulp.task('generate:bundle', () => {
  return generate('bundle');
});

gulp.task('generate:component', () => {
  return generate('component');
});

gulp.task('generate:service', () => {
  return generate('service');
});

gulp.task('generate:directive', () => {
  config.error('Directive generation is not yet implemented');
  //return generate('directive', 'directives', true, false, false);
});
