import './common.styl';
import angular from 'angular';
import commonComponentsModule from './components/components';
import commonServicesModule from './services/services';
import commonDevServicesModule from './dev-services/services';

const deps = [
  commonComponentsModule.name,
  commonServicesModule.name,
];

if (process.env.ENV === process.env.CONST_ENV_DEV) {
  deps.push(commonDevServicesModule.name);
}

const commonModule = angular.module('common', deps);

export default commonModule;
