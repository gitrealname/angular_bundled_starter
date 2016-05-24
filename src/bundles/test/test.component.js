import './test.styl';
import template from './test.html';

export class TestController {
  constructor(testDataService) {
    'ngInject';
    this.testDataService = testDataService;

    //public
    this.name = 'test';
    this.dataList = [];

    //private
    this.creationTime = new Date();

    //initialize
    this.activate();
  }

  // Methods
  activate() {
    if (process.env.ENV === process.env.CONST.TEST_ENV) {
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
