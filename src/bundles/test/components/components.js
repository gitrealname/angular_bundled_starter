import angular from 'angular';
import About from './about/about';
import Navbar from './navbar/navbar';

export default angular.module('test.components', [
  About.name,
  Navbar.name,
]);

