import angular from 'angular';
import aboutModule from './about';
import navbarModule from './navbar';

export default angular.module('test.components', [
  aboutModule.name,
  navbarModule.name,
]);

