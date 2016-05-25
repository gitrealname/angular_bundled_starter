import angular from 'angular';
import masterConfig from './config.json';
import devDiffConfig from './config.development.json';

const commonConfig = angular.module('test.config', ['common.services'])

.config(['configServiceProvider', (configProvider) => {
  configProvider.mergeConfig(masterConfig);
  if (process.env.ENV === process.env.CONST_ENV_DEV) {
    configProvider.mergeConfig(devDiffConfig);
  }
}])
;

export default commonConfig;
