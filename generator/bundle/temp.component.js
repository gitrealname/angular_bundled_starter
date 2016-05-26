import './<%= lispName %>.styl';
import template from './<%= lispName %>.html';

export class <%= camelCapName %>Controller {
  constructor(<%= camelName %>Service, configService) {
    'ngInject';
    //initialize
    this.<%= camelName %>Service = <%= camelName %>Service;
    this.configService = configService;

    //public
    this.name = '<%= camelFullName %>';
    this.description = 'loading from config...';
    this.dataList = [];
    this.creationTime = new Date();

    //private
    this.myPrivateVar = new Date();
  }

  /*
  * Event handlers
  */
  $onInit() {
    this.description = this.configService.get('<%= camelName %>').description;
    console.log(`component '${this.name}' activated.`);
  }

  $onDestroy() {
    console.log(`component '${this.name}' destroyed.`);
  }

  /*
  * Methods
  */
  //get test model
  onGetData() {
    this.<%= camelName %>Service.getModel().then((result) => {
      this.dataList = result.dataList || ['ERROR'];
    });
  }
} // TestController

export default {
  bindings: {},
  transclude: false,
  template,
  controller: <%= camelCapName %>Controller,
  controllerAs: 'vm',
};
