import './navbar.styl';
import template from './navbar.html';

export class NavbarController {
  constructor() {
    this.name = 'Test home';
  }
}

export default {
  bindings: {},
  transclude: false,
  template,
  controller: NavbarController,
  controllerAs: 'vm',
};
