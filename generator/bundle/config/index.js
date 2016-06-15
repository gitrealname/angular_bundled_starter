/// <reference path="<%=  rootRelativePath %>../typings/index.d.ts" />
import angular from 'angular';
import masterConfig from './config.json';
import devDiffConfig from './config.development.json';

const <%= camelName %>Config = angular.module('<%= dotedAppPrefix %><%= dotedLispFullName %>.config', ['<%= dotedAppPrefix %>common.services'])

.config(['configServiceProvider', (configProvider) => {
  configProvider.mergeConfig(masterConfig);
  if (process.env.ENV === process.env.CONST_ENV_DEV) {
    configProvider.mergeConfig(devDiffConfig);
  }
}])
;

export default <%= camelName %>Config;
