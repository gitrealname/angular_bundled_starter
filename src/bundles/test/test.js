import './test.styl';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from '../../common/common';
import Components from './components/components';
import Services from './services/services';

angular.module('test', [
  uiRouter,
  Common.name,
  Components.name,
  Services.name,
])

.config(($locationProvider) => {
  'ngInject';
  // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
  // #how-to-configure-your-server-to-work-with-html5mode
  // @see: https://github.com/angular-ui/ui-router/issues/2627
  // #how-to-use-ui-router-with-components
  $locationProvider.html5Mode(true).hashPrefix('!');
});
