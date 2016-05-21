import './test.styl';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from '../../common/common';
import Components from './components/components';
import Services from './services/services';
import TestComponent from './test.component';
import config from './config';

export default angular.module('test', [
  uiRouter,
  Common.name,
  Components.name,
  Services.name,
])

.config(($locationProvider, $urlRouterProvider, $stateProvider) => {
  'ngInject';

  // #how-to-configure-your-server-to-work-with-html5mode
  // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
  let url = '/test';
  if (process.env.ONLY_BUNDLE) {
    $locationProvider.html5Mode(false).hashPrefix('!');
    $urlRouterProvider.otherwise('/');
    url = '';
  }

  $stateProvider.state('test', {
    component: 'test',
    url, // url is relative to parrent state's url
    resolve: { },
    data: {
      title: 'test',
    },
  });
})

.component('test', TestComponent)

.constant('config', config);
