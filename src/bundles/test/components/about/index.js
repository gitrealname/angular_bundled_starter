import angular from 'angular';
import uiRouter from 'angular-ui-router';
import aboutComponent from './about.component';

export default angular.module('test.about', [
  uiRouter,
])

.config(($stateProvider) => {
  'ngInject';
  const url = '/about';
  $stateProvider.state('test.about', {
    component: 'testAbout',
    url,
    resolve: { },
    data: {
      title: 'about',
    },
  });
})

.component('testAbout', aboutComponent);
