import './common.styl';
import angular from 'angular';
import commonComponentsModule from './components/components';
import commonServicesModule from './services/services';

const commonModule = angular.module('common', [
  commonComponentsModule.name,
  commonServicesModule.name,
]);

export default commonModule;
