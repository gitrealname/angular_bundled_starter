import angular from 'angular';
import uiRouter from 'angular-ui-router';
import AboutComponent from './about.component';

export default angular.module('test.about', [
  uiRouter,
])

.config(($stateProvider) => {
  'ngInject';

  $stateProvider.state('test.about', {
    component: 'testAbout',
    url: '^/about', // url is relative to parrent state's url
    resolve: { },
    data: {
      title: 'about',
    },
  });
})

.component('testAbout', AboutComponent);
