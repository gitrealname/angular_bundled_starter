import angular from 'angular';
import requestUrlCorrectionInterceptor from './request-url-correction.interceptor';
import configServiceProvider from './config.provider';

const commonServicesModule = angular.module('common.services', [
])

.provider('configService', configServiceProvider)

.config(['$httpProvider', ($httpProvider) => {
  $httpProvider.interceptors.push(requestUrlCorrectionInterceptor);
}])
;

export default commonServicesModule;

