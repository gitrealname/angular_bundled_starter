import angular from 'angular';
import RequestMockServerProxyInterceptor from './request-mock-server-proxy.interceptor';

const CommonDevServicesModule = angular.module('common.dev-services', [])

.config(['$httpProvider', ($httpProvider) => {
  $httpProvider.interceptors.push(RequestMockServerProxyInterceptor);
}])
;

export default CommonDevServicesModule;

