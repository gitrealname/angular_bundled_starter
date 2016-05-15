import './test.styl';
import template from './test.html';

export class TestController {
  constructor() {
    'ngInject';
    this.name = 'test';
  }
}

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: TestController,
  controllerAs: 'vm',
};
