/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
import './<%= lispName %>.styl';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import <%= camelName %>Component from './<%= lispName %>.component';

export default angular.module('<%= dotedAppPrefix %><%= dotedLispFullName %>', [
  uiRouter,
])

.component('<%= appPrefix %><%= camelCapFullName %>', <%= camelName %>Component)

.config(($locationProvider, $urlRouterProvider, $stateProvider) => {
  'ngInject';
  /*
  * for details on ui-router component router
  * See: https://github.com/angular-ui/ui-router/issues/2627
  */
  $stateProvider.state('<%= dotedLispFullName %>', {
    component: '<%= appPrefix %><%= camelCapFullName %>',
    url: '/<%= lispName %>',
    resolve: { },
    data: {
      title: '<%= dotedCamelCapFullName %> title',
    },
  });
})
;
