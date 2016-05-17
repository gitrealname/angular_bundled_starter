import angular from 'angular';
import uiRouter from 'angular-ui-router';
import <%= pName %>Component from './<%= lcName %>.component';

export default angular.module('<%= dotedFullName %>', [
  uiRouter,
])

.config(($stateProvider) => {
  'ngInject';

  /*
  * ui-router component biding:
  * See: https://github.com/angular-ui/ui-router/issues/2627
  */
  $stateProvider.state('<%= dotedFullName %>', {
    component: '<%= cFullName %>',
    url: '/<%= lcName %>', // url is relative to parrent state's url
    resolve: { },
  });
})

.component('<%= cFullName %>', <%= pName %>Component);
