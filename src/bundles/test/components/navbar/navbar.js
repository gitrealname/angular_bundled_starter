import angular from 'angular';
import uiRouter from 'angular-ui-router';
import NavbarComponent from './navbar.component';

const navbarModule = angular.module('test.navbar', [
  uiRouter,
])

.component('testNavbar', NavbarComponent);

export default navbarModule;
