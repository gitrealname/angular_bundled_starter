import gulp from 'gulp';
import rename from 'gulp-rename';
import template from 'gulp-template';

import config from '../config';

gulp.task('generate:component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = config.getProcessingFlag('name');
  const bundle = config.getProcessingFlag('bundle');
  const parentPath = config.getProcessingFlag('parent') || '';
  const destPath = config.rootSrc('bundles', bundle, 'components', parentPath, name);

  return gulp.src(config.rootGenerator('component/**/*.**'))
    .pipe(template({
      name,
      upCaseName: cap(name),
    }))
    .pipe(rename((p) => {
      p.basename = p.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});
