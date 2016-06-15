/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
import './<%= lispName %>.styl';
import template from './<%= lispName %>.html';

export class <%= camelCapName %>Controller {
  constructor(configService) {
    'ngInject';
    //initialize
    this.configService = configService;

    //public
    this.name = '<%= camelFullName %>';
    this.description = 'loading from config...';
    this.creationTime = new Date();

    //private
    this.myPrivateVar = new Date();
  }

  /*
  * Event handlers
  */
  $onInit() {
    this.description = 'no description';
    console.log(`component '${this.name}' activated.`);
  }

  $onDestroy() {
    console.log(`component '${this.name}' destroyed.`);
  }

  /*
  * Methods
  */
} // TestController

export default {
  bindings: {},
  transclude: false,
  template,
  controller: <%= camelCapName %>Controller,
  controllerAs: 'vm',
};
