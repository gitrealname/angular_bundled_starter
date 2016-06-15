/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
import angular from 'angular';
import <%= camelName %>Model from './<%= lispName %>.model';

export default angular.module('<%= dotedAppPrefix %><%= dotedLispParentFullName %>.models', [
])

.factory('<%= camelCapName %>', <%= camelName %>Model)

;
