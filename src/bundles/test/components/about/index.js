import angular from 'angular';
import uiRouter from 'angular-ui-router';
import aboutComponent from './about.component';

export default angular.module('test.about', [
  uiRouter,
])

.component('xxTestAbout', aboutComponent)

.config(($stateProvider) => {
  'ngInject';
  const url = '/about';
  $stateProvider.state('test.about', {
    component: 'xxTestAbout',
    url,
    resolve: { },
    data: {
      title: 'about',
    },
  });
})
;
