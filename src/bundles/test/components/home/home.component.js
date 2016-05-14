import './home.styl';
import template from './home.html';

export class HomeController {
  constructor() {
    'ngInject';
    this.name = 'home';
  }
}

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: HomeController,
  controllerAs: 'vm',
};
