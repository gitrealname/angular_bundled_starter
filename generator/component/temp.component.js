import './<%= lcName %>.styl';
import template from './<%= lcName %>.html';

export class <%= pName %>Controller {
  constructor() {
    'ngInject';
    this.name = '<%= cFullName %>';
  }
}

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: <%= pName %>Controller,
  controllerAs: 'vm',
};
