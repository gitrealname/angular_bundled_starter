/// <reference path="<%=  rootRelativePath %>../typings/index.d.ts" />
/*eslint no-unused-expressions: "off"*/
/*eslint no-unused-vars: "off"*/
/*global describe it beforeEach inject expect angular mocks sinon chai*/

/*
* Useful links regarding unit-testing:
* See: https://gist.github.com/yoavniran/1e3b0162e1545055429e
*      http://sinonjs.org/docs/
*/
const expect = chai.expect;
const spy = sinon.spy;
const stub = sinon.stub;

import <%= camelCapName %>Service from './<%= lispName %>.service';

describe(' <%= dotedCamelCapFullName %> service', () => {
  const service = new <%= camelCapName %>Service;

  beforeEach(inject(() => {
  }));


  it('service is instance of <%= camelName %>Service', () => {
    expect(service).to.be.an.instanceof(<%= camelCapName %>Service);
  });
});
