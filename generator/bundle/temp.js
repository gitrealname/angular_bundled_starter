import './<%= bundleName %>.styl';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from '../../common/common';
import Components from './components/components';
import Services from './services/services';
import config from './config';
import <%= pName %>Component from './<%= bundleName %>.component';

const <%= bundleName %>Config = angular.module('<%= bundleName %>Config', [])

.constant('config', config);

export default angular.module('<%= bundleName %>', [
  <%= bundleName %>Config.name,
  uiRouter,
  Common.name,
  Components.name,
  Services.name,
])

.config(($locationProvider, $urlRouterProvider, $stateProvider) => {
  'ngInject';
  // #how-to-configure-your-server-to-work-with-html5mode
  // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
  $locationProvider.html5Mode(true).hashPrefix('!');

  $urlRouterProvider.otherwise('/');
  $urlRouterProvider.when('/', '/<%= bundleName %>');

  $stateProvider
    .state('<%= bundleName %>', {
      url: '/<%= bundleName %>',
      template: '<<%= bundleName %>>Loading...</<%= bundleName %>>',
    });
})

.component('<%= bundleName %>', <%= pName %>Component);
