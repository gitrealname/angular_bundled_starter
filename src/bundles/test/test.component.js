import './test.styl';
import template from './test.html';

export class TestController {
  constructor($http) {
    'ngInject';
    this.$http = $http;

    //public
    this.name = 'test';
    this.httpName = 'loading...';

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
    this.$http.get('/dev.server.data/test.json').then((response) => {
      this.httpName = response.data.testResponse.value1;
    }).catch((err) => {
      this.httpName = err;
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
