import './<%= lispName %>.styl';
import angular from 'angular';
import <%= camelName %>Component from './<%= lispName %>.component';

export default angular.module('<%= dotedCamelFullName %>', [
  uiRouter,
])

.component('<%= camelFullName %>', <%= camelName %>Component)

.config(($locationProvider, $urlRouterProvider, $stateProvider) => {
  'ngInject';
  /*
  * for details on ui-router component router
  * See: https://github.com/angular-ui/ui-router/issues/2627
  */
  $stateProvider.state('<%= dotedCamelFullName %>', {
    component: '<%= camelFullName %>',
    url: '/<%= lispName %>',
    resolve: { },
    data: {
      title: '<%= dotedCamelCapFullName %> title',
    },
  });
})
;
