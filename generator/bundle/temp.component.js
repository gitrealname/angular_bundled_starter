import './<%= bundleName %>.styl';
import template from './<%= bundleName %>.html';

export class <%= pName %>Controller {
  constructor() {
    'ngInject';
    this.name = '<%= bundleName %>';
  }
}

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: <%= pName %>Controller,
  controllerAs: 'vm',
};
