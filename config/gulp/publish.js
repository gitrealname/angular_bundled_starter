/*eslint global-require: 0*/
/*eslint max-len: 0*/

/*
* See: https://www.npmjs.com/package/gulp-help
* See: https://www.npmjs.com/package/run-sequence
* See: https://webpack.github.io/docs/usage-with-gulp.html
*/
const gulp = require('gulp-help')(require('gulp'));
import replace from 'gulp-replace';
import runSequence from 'run-sequence';

import config from '../config';

const sourceRootRx = new RegExp('("sourceRoot"\\s*:\\s*")([^"]*")', 'i');

gulp.task('publish:scripts', () => {
  const dest = config.rootPublish(config.data.publish.scripts);
  config.info('Publishing scripts to: ', dest);
  const src = config.root(config.data.dest.prod);
  const task = gulp.src([src + '/**/*.js'])
    .pipe(gulp.dest(dest, {
      overwrite: true,
    }));
  return task;
});

gulp.task('publish:scripts:sourcemaps', () => {
  const dest = config.rootPublish(config.data.publish.scripts);
  config.info('Publishing scripts sourcemaps to: ', dest);
  const src = config.root(config.data.dest.prod);
  const sourcemapPath = config.pathDiffToRelativePath(config.rootSrc(), dest);
  const task = gulp.src([src + '/**/*.js.map'])
    .pipe(replace(sourceRootRx, '$1' + sourcemapPath + '"'))
    .pipe(gulp.dest(dest, {
      overwrite: true,
    }));
  return task;
});

gulp.task('publish:styles', () => {
  const dest = config.rootPublish(config.data.publish.styles);
  config.info('Publishing styles to: ', dest);
  const src = config.root(config.data.dest.prod);
  const task = gulp.src([src + '/**/*.css'])
    .pipe(gulp.dest(dest, {
      overwrite: true,
    }));
  return task;
});

gulp.task('publish:styles:sourcemaps', () => {
  const dest = config.rootPublish(config.data.publish.styles);
  config.info('Publishing styles sourcemaps to: ', dest);
  const src = config.root(config.data.dest.prod);
  const sourcemapPath = config.pathDiffToRelativePath(config.rootSrc(), dest);
  const task = gulp.src([src + '/**/*.css.map'])
    .pipe(replace(sourceRootRx, '$1' + sourcemapPath + '"'))
    .pipe(gulp.dest(dest, {
      overwrite: true,
    }));
  return task;
});

gulp.task('publish:assets', () => {
  const dest = config.rootPublish(config.data.publish.content);
  config.info('Publishing assets to: ', dest);
  const src = config.root(config.data.dest.prod, config.data.dir.assets);
  const task = gulp.src([src + '/**/*.*'])
    .pipe(gulp.dest(dest, {
      overwrite: true,
    }));
  return task;
});

gulp.task('publish:only',
  'Publish bundles without re-build. IMPORTANT: may be used for debugging purposes only!.',
  ['publish:scripts', 'publish:scripts:sourcemaps', 'publish:styles', 'publish:styles:sourcemaps', 'publish:assets']);


gulp.task('publish:debug', 'Builds and publishes debug bundles.', () => {
  runSequence('build:debug', 'publish:only');
});

gulp.task('publish:release', 'Builds and publishes Release bundles.', () => {
  runSequence('build:release', 'publish:only');
});

gulp.task('publish', 'Default publish => Release', ['publish:release']);
