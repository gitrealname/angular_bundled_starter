import './<%= lispName %>.styl';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import commonModule from '../../common';
import componentsModule from './components';
import servicesModule from './services';
import <%= camelName %>Component from './<%= lispName %>.component';
import configModule from './config';

export default angular.module('<%= dotedCamelFullName %>', [
  uiRouter,
  configModule.name,
  commonModule.name,
  componentsModule.name,
  servicesModule.name,
])

.component('<%= camelFullName %>', <%= camelName %>Component)

.config(($locationProvider, $urlRouterProvider, $stateProvider) => {
  'ngInject';

  // Having '^' in front prevents double '/' when used along with other bundles
  let url = '/<%= lispName %>';
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
  $stateProvider.state('<%= dotedCamelFullName %>', {
    component: '<%= camelFullName %>',
    url,
    resolve: { },
    data: {
      title: '<%= camelName %> title',
    },
  });
})
;

/*
*  To use this bundle as page entry point, make html similar to this example:
   ...
   <body ng-app="<%= dotedCamelFullName %>" ng-strict-di ng-cloak>
    <ui-view/>

     <script type="text/javascript" src="/vendor.js"></script>
     <script type="text/javascript" src="/common.js"></script>
     <script type="text/javascript" src="/<%= lispName %>.js"></script>
   </body>
*/
