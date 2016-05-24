import './navbar.styl';
import template from './navbar.html';

export class NavbarController {
  constructor() {
    this.name = 'Test home';
  }
}

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: NavbarController,
  controllerAs: 'vm',
};
