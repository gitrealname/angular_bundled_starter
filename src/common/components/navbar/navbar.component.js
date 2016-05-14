import './navbar.styl';
import template from './navbar.html';

export class NavbarController {
  constructor() {
    this.name = 'navbar';
  }
}

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: NavbarController,
  controllerAs: 'vm',
};
