
export default class TestDataService {
  constructor($http) {
    'ngInject';
    this.$http = $http;
  }

  getModel() {
    return this.$http.get('Home/GetTestModel').then((response) => {
      return response.data;
    }).catch((err) => {
      console.log(err);
      return undefined;
    });
  }
}

