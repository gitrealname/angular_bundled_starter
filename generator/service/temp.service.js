/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
export default class <%= camelCapName %>Service {
  constructor($http) {
    'ngInject';
    this.$http = $http;
  }

  doSomethingOverHttp() {
    return this.$http.get('Home/Get<%= camelCapName %>Model').then((response) => {
      return response.data;
    }).catch((err) => {
      console.log(err);
      return ['doSomethingOverHttp() ERROR!'];
    });
  }
}

