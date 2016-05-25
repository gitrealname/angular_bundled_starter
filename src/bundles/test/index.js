import './test.styl';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import common from '../../common';
import components from './components/components';
import services from './services/services';
import TestComponent from './test.component';
import config from './config';

export default angular.module('test', [
  config.name,
  uiRouter,
  common.name,
  components.name,
  services.name,
])

.component('test', TestComponent)

.config(($locationProvider, $urlRouterProvider, $stateProvider) => {
  'ngInject';

  // Having '^' in front prevents double '/' when used along with other bundles
  let url = '^/test';
  if (process.env.ONLY_BUNDLE || process.env.ENV === process.env.CONST_ENV_PROD) {
    /*
    * none-html5mode by default. For details
    * See: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    */
    $locationProvider.html5Mode(false).hashPrefix('!');
    $urlRouterProvider.otherwise('/');
    url = '/';
  }

  /*
  * for details on ui-router component router
  * See: https://github.com/angular-ui/ui-router/issues/2627
  */
  $stateProvider.state('test', {
    component: 'test',
    url,
    resolve: { },
    data: {
      title: 'test',
    },
  });
})
;

/*
*  To use this bundle as page entry point, make html similar to this example:
   ...
   <body ng-app="test" ng-strict-di ng-cloak>
    <ui-view/>

     <script type="text/javascript" src="/vendor.js"></script>
     <script type="text/javascript" src="/common.js"></script>
     <script type="text/javascript" src="/test.js"></script>
   </body>
*/
