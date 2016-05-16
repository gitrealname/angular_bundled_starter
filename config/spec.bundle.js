/*eslint prefer-template: 0*/
/*eslint max-len: 0*/
/*eslint no-undef: 0*/
/*eslint no-unused-vars: "off"*/
/*
 * When testing with Webpack and ES6, we have to do some
 * preliminary setup. Because we are writing our tests also in ES6,
 * we must transpile those as well, which is handled inside
 * `karma.conf.js` via the `karma-webpack` plugin. This is the entry
 * file for the Webpack tests. Similarly to how Webpack creates a
 * `bundle.js` file for the compressed app source files, when we
 * run our tests, Webpack, likewise, compiles and bundles those tests here.
*/

const angular = require('angular');
const mocks = require('angular-mocks');

// We use the context method on `require` which Webpack created
// in order to signify which files we actually want to require or import.
// Below, `context` will be a/an function/object with file names as keys.
// Using that regex, we scan within `client/app` and target
// all files ending with `.spec.js` and trace its path.
// By passing in true, we permit this process to occur recursively.
//NOTE: variables in require.context don't work!!!
const context = require.context('../src', true, /\.spec\.(ts|js)/);

//Filtertest files, leave only those that were explicetly specified
// by --name command line param (which is stored in process.env.PARAMS)
// Accept all files if --name was not specified
const list = context.keys().filter((val) => {
  if (!process.env.NAMES.length) {
    return true;
  }
  // remove leading './'
  const chunks = val.split('/').slice(1);
  let bundle = chunks[0];
  //if starts with bundles, take next elem
  if (bundle === 'bundles') {
    bundle = chunks[1];
  }
  //search for bundle in the name list
  return process.env.NAMES.indexOf(bundle) >= 0;
});

/*DEBUG:
list.forEach((val) => {
  console.log(val);
});
*/

// Get all files, for each file, call the context function
// that will require the file and load it here. Context will
// loop and require those spec files here.
const modules = list.forEach(context);

