import angular from 'angular';
import TodoList from './todoList.service';
import requestUrlCorrectionInterceptor from './request-url-correction.interceptor';

const commonServicesModule = angular.module('common.services', [
])

.service('todoList', TodoList)

.config(['$httpProvider', ($httpProvider) => {
  $httpProvider.interceptors.push(requestUrlCorrectionInterceptor);
}])
;

export default commonServicesModule;

