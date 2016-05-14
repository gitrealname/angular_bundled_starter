import './about.styl';
import template from './about.html';

export class AboutController {
  constructor() {
    'ngInject';
    this.name = 'about';
  }
}

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: AboutController,
  controllerAs: 'vm',
};
