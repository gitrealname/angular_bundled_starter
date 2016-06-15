/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
import './<%= lispName %>.styl';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import commonModule from '../../common';
import componentsModule from './components';
import servicesModule from './services';
import <%= camelName %>Component from './<%= lispName %>.component';
import configModule from './config';
import homeContent from './home-content.html';

export default angular.module('<%= dotedAppPrefix %><%= dotedLispFullName %>', [
  uiRouter,
  configModule.name,
  commonModule.name,
  componentsModule.name,
  servicesModule.name,
])

.component('<%= appPrefix %><%= camelCapFullName %>', <%= camelName %>Component)

.run(($rootScope, $state, $stateParams) => {
  'ngInject';
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
})

.config(($locationProvider, $urlRouterProvider, $stateProvider) => {
  'ngInject';

  let url = '/<%= lispName %>';
  if (process.env.ONLY_BUNDLE || process.env.ENV === process.env.CONST_ENV_PROD) {
    /*
    * none-html5mode by default. For details
    * See: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    */
    $locationProvider.html5Mode(false).hashPrefix('!');
    $urlRouterProvider.otherwise('/');
    url = '';
  }

  /*
  * for details on ui-router component router
  * See: https://github.com/angular-ui/ui-router/issues/2627
  */
  $stateProvider.state('<%= dotedLispFullName %>', {
    abstract: true,
    component: '<%= appPrefix %><%= camelCapFullName %>',
    url,
  });

  $stateProvider.state('<%= dotedLispFullName %>.home', {
    template: homeContent,
    url: '/',
    resolve: { },
    data: {
      title: '<%= camelCapName %> title',
    },
  });
})
;
