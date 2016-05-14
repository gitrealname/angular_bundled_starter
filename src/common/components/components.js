import angular from 'angular';
import navbar from './navbar/navbar';

const commonComponentsModule = angular.module('common.components', [
  navbar.name,
]);

export default commonComponentsModule;
