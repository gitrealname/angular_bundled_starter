import angular from 'angular';
import uiRouter from 'angular-ui-router';
import navbarComponent from './navbar.component';

const navbarModule = angular.module('common.navbar', [
  uiRouter,
])

.component('commonNavbar', navbarComponent);

export default navbarModule;
