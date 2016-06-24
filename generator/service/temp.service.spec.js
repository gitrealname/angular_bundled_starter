/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
/*eslint no-unused-expressions: "off"*/
/*eslint no-unused-vars: "off"*/
/*global describe it beforeEach inject expect angular mocks sinon chai*/

/*
* Useful links regarding unit-testing:
* See: https://gist.github.com/yoavniran/1e3b0162e1545055429e
*      http://sinonjs.org/docs/
*      https://mochajs.org/
*      https://github.com/domenic/sinon-chai
*/
const expect = chai.expect;
const spy = sinon.spy;
const stub = sinon.stub;

import <%= camelCapName %>Service from './<%= lispName %>.service';

beforeEach(angular.mock.module(($provide) => {
  $provide.service('<%= camelName %>Service', <%= camelCapName %>);
}));

describe('<%= dotedCamelCapFullName %> service', () => {
  let service;

  beforeEach(inject((_<%= camelName %>Service_) => {
    service = _<%= camelName %>Service_;
  }));


  it('service is instance of <%= camelCapName %>Service', () => {
    expect(service).to.be.an.instanceof(<%= camelCapName %>Service);
  });
});
