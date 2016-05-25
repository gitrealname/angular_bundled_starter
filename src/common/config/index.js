import angular from 'angular';
import baseConfig from './config.json';
import devDiffCfg from './config.development.json';

const commonConfigModule = angular.module('common.config', ['common.services'])

.config(['configServiceProvider', (configProvider) => {
  configProvider.mergeConfig(baseConfig);
  if (process.env.ENV === process.env.CONST_ENV_DEV) {
    configProvider.mergeConfig(devDiffCfg);
  }
}])
;

export default commonConfigModule;
