/// <reference path="<%=  rootRelativePath %>../typings/index.d.ts" />
import angular from 'angular';
import <%= camelCapName %>Service from './<%= lispName %>.service';

export default angular.module('<%= dotedAppPrefix %><%= dotedLispFullName %>.services', [
])

.service('<%= camelFullName %>Service', <%= camelCapName %>Service)

;
