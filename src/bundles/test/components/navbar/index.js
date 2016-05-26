import angular from 'angular';
import uiRouter from 'angular-ui-router';
import navbarComponent from './navbar.component';

const navbarModule = angular.module('test.navbar', [
  uiRouter,
])

.component('testNavbar', navbarComponent);

export default navbarModule;
