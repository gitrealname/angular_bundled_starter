/// <reference path="<%= rootRelativePath %>typings/index.d.ts" />
import angular from 'angular';
import <%= camelName %>Directive from './<%= lispName %>.directive';

export default angular.module('<%= dotedAppPrefix %><%= dotedLispParentFullName %>.directives', [
])

.directive('<%= appPrefix %><%= camelCapFullName %>', <%= camelName %>Directive)

;
