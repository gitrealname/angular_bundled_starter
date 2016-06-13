import angular from 'angular';
import <%= camelCapName %>Service from './<%= lispName %>.service';

export default angular.module('<%= dotedAppPrefix %><%= camelFullName %>.services', [
])

.service('<%= camelFullName %>Service', <%= camelCapName %>Service)

;
