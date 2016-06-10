import './test.styl';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import common from '../../common';
import components from './components';
import services from './services';
import testComponent from './test.component';
import config from './config';
import homeContent from './home-content.html';

export default angular.module('test', [
  config.name,
  uiRouter,
  common.name,
  components.name,
  services.name,
])

.component('test', testComponent)

.config(($locationProvider, $urlRouterProvider, $stateProvider) => {
  'ngInject';

  let url = '/test';
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
  $stateProvider.state('test', {
    abstract: true,
    selector: 'xx-test',
    component: 'test',
    url,
  });

  //default bundle state
  $stateProvider.state('test.home', {
    template: homeContent,
    url: '/',
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
