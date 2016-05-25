import './test.styl';
import template from './test.html';

export class TestController {
  constructor(testDataService, currentTimeService, configService) {
    'ngInject';
    this.testDataService = testDataService;
    this.currentTimeService = currentTimeService;
    this.configService = configService;

    //public
    this.name = 'test';
    this.dataList = [];
    this.description = configService.get('test').description;

    //private
    this.creationTime = new Date();

    //initialize
    this.activate();
  }

  // Methods
  activate() {
    if (process.env.ENV === process.env.CONST_ENV_TEST) {
      return;
    }
    console.log(`controler '${this.name}' activated.`);
  }

  onGetData() {
    //get test model
    this.testDataService.getModel().then((result) => {
      this.dataList = result.dataList || ['ERROR'];
    });
  }
} // TestController

export default {
  restrict: 'E',
  bindings: {},
  template,
  controller: TestController,
  controllerAs: 'vm',
};
