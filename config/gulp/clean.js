/*eslint prefer-template: 0*/

/*
* See: https://www.npmjs.com/package/gulp-help
*/
const gulp = require('gulp-help')(require('gulp'));
import del from 'del';

import config from '../config';

function cleanList() {
  return Object.keys(config.data.dest).map((key) => {
    return config.data.dest[key];
  });
}

gulp.task('clean', 'remove intermmediate files', () => {
  return del(cleanList());
});
