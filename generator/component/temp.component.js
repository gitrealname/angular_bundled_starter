import template from './<%= name %>.html';
import './<%= name %>.styl';

export class <%= upCaseName %>Controller {
  constructor() {
    'ngInject';
    this.name = '<%= name %>';
  }
}

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: <%= upCaseName %>Controller,
  controllerAs: 'vm',
};


