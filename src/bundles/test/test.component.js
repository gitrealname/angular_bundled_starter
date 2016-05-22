import './test.styl';
import template from './test.html';

export class TestController {
  constructor() {
    'ngInject';
    const vm = this;

    //public
    vm.name = 'test';

    //private
    vm.creationTime = new Date();

    //initialize
    vm.activate();
  }

  // Methods
  activate() {
    console.log(`controler '${this.name}' activated.`);
  }
}

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: TestController,
  controllerAs: 'vm',
};
