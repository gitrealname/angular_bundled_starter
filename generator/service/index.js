import angular from 'angular';
import <%= camelCapName %>Service from './<%= lispName %>.service';

export default angular.module('<%= camelFullName %>.services', [
])

.service('<%= camelFullName %>Service', <%= camelCapName %>Service)

;
