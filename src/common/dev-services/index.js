import angular from 'angular';
import requestMockServerProxyInterceptor from './request-mock-server-proxy.interceptor';

const CommonDevServicesModule = angular.module('common.dev-services', [])

.config(['$httpProvider', ($httpProvider) => {
  $httpProvider.interceptors.push(requestMockServerProxyInterceptor);
}])
;

export default CommonDevServicesModule;

