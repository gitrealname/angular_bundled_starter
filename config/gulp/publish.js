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

gulp.task('publish:scripts', () => {

});

gulp.task('publish:styles', () => {

});

gulp.task('publish:content', () => {

});

gulp.task('publish', 'Builds and publishes bundles.', [], () => {
  const root = config.rootPublish();
  config.warn('Publishing to: ', root);
});

gulp.task('publish:sourcemap:fix', 'fixes source maps', () => {
  const relativeSrcPath = config.pathDiffToRelativePath(config.rootSrc(), 'config.data.dest.prod');
  const rx = new RegExp('"(webpack:\\/\\/\\/){2}([^"]+)\\/' + config.data.dir.src + '\\/\\2[^"]+"([,]?)', 'gi');

  const task = gulp.src([config.root(config.data.dest.prod) + '/**/*.map'])
  //remove: webpack:///webpack:///xxx/yyy/src/xxx/yyy
  .pipe(replace(rx, ''))
  //remove: ,"webpack:///webpack/bootstrap 298d98bea3abdfa02153"
  .pipe(replace(/,"webpack:\/\/\/webpack\/bootstrap\s+[\d+a-f]+"/ig, ''))
  //remove: "webpack:/// ....?130.."
  .pipe(replace(/"webpack:\/\/\/[^"]*?(js|ts)\?[0-9a-f]+"([,]?)/ig, ''))
  //remove webpack url
  .pipe(replace(/(webpack:\/\/\/)+(\.\/)?/g, './'))
  //fix node module path
  .pipe(replace(/("\.\/\.\.\/)~/g, '$1' + config.data.dir.node))
  //remove source entry that is point to bundle file (it is always has single '/' and is infront of sources)
  .pipe(replace(/("sources":\[)"\.\/[^\/"]+"([,]?)/, '$1'))
  //fix array ending after removal of content
  .pipe(replace(/",]/g, '"]'))
  //set srouceRoot
  .pipe(replace(/("sourceRoot".*?:.*?").*?"/, '$1' + relativeSrcPath + '"'))

  .pipe(gulp.dest(config.data.dest.prod, {
    overwrite: true,
  }));

  return task;
});

gulp.task('build', 'Build deployment package.', () => {
  runSequence('build:clean', 'build:release', 'build:sourcemap:fix');
});
