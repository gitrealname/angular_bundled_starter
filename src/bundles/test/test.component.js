import './test.styl';
import template from './test.html';

export class TestController {
  constructor(testDataService, currentTimeService, configService) {
    'ngInject';
    //initialize
    this.testDataService = testDataService;
    this.currentTimeService = currentTimeService;
    this.configService = configService;

    //public
    this.name = 'test';
    this.dataList = [];
    this.description = configService.get('test').description;
    this.creationTime = new Date();

    //private
    this.myPrivateVar = new Date();
  }

  /*
  * Event handlers
  */
  $onInit() {
    this.description = this.configService.get('test').description;
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
    this.testDataService.getModel().then((result) => {
      this.dataList = result.dataList || ['ERROR'];
    });
  }
} // TestController

export default {
  bindings: {},
  transclude: false,
  template,
  controller: TestController,
  controllerAs: 'vm',
};
