/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
import './<%= lispName %>.styl';
import template from './<%= lispName %>.html';

export class <%= camelCapName %>Controller {
  constructor($log) {
    'ngInject';
    //initialize
    this.$log = $log;

    //public

    //private
  }

  /*
  * Event handlers
  */
  $onInit() {
    this.$log.log(`component '<%= dotedCamelFullName =>' activated.`);
  }

  $onDestroy() {
    this.$log.log(`component '<%= dotedCamelFullName =>' destroyed.`);
  }

  /*
  * Methods
  */
} // <%= camelCapName %>Controller

export default {
  bindings: {},
  transclude: false,
  template,
  controller: <%= camelCapName %>Controller,
  controllerAs: 'vm',
};
