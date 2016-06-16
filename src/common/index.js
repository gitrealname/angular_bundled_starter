import './common.styl';
import {} from '../polyfills';
import angular from 'angular';
import commonComponentsModule from './components';
import commonServicesModule from './services';
import commonDirectivesModule from './directives';
import configModule from './config';
import commonDevServicesModule from './dev-services';

const deps = [
  commonComponentsModule.name,
  commonServicesModule.name,
  commonDirectivesModule.name,
  configModule.name,
];

if (process.env.ENV === process.env.CONST_ENV_DEV) {
  deps.push(commonDevServicesModule.name);
}

const commonModule = angular.module('common', deps);

export default commonModule;
