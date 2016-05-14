import angular from 'angular';
import Home from './home/home';
import About from './about/about';

export default angular.module('test.components', [
  Home.name,
  About.name,
]);

