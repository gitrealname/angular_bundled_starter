import './<%= lispName %>.styl';
import template from './<%= lispName %>.html';

export class <%= camelCapName %>Controller {
  constructor(configService) {
    'ngInject';
    //initialize
    this.<%= camelName %>Service = <%= camelName %>Service;
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
    this.description = this.configService.get('<%= camelName %>').description || 'no description';
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
