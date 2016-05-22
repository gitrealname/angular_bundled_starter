import angular from 'angular';
import uiRouter from 'angular-ui-router';
import AboutComponent from './about.component';

export default angular.module('test.about', [
  uiRouter,
])

.config(($stateProvider) => {
  'ngInject';
  let url = '/about';
  if (process.env.ONLY_BUNDLE || process.env.ENV === process.env.CONST.PROD_ENV) {
    // Having '^' prevents double '/' when parent state url is '/'
    url = '^/about';
  }
  $stateProvider.state('test.about', {
    component: 'testAbout',
    url,
    resolve: { },
    data: {
      title: 'about',
    },
  });
})

.component('testAbout', AboutComponent);
