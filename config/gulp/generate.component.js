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

function generate(generatorType, dir, isBundle = false) {
  const tmpl = config.createGeneratorTemplateParams(dir, isBundle);
  return gulp.src(config.rootGenerator(generatorType + '/**/*.**'))
    .pipe(template(tmpl))
    .pipe(rename((p) => {
      p.basename = p.basename.replace('temp', tmpl.lcName);
    }))
    .pipe(gulp.dest(tmpl.destPath));
}

gulp.task('generate:component', () => {
  return generate('component', 'components', false);
});

gulp.task('generate:bundle', () => {
  return generate('bundle', undefined, true);
});

gulp.task('generate:service', () => {
  return generate('service', 'services', false);
});

gulp.task('generate:directive', () => {
  return generate('directive', 'directives', false);
});
