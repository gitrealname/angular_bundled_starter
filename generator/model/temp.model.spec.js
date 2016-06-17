/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
/*eslint no-unused-expressions: "off"*/
/*eslint no-unused-vars: "off"*/
/*global describe it beforeEach inject expect angular mocks sinon chai*/

/*
* Useful links regarding unit-testing:
* See: https://gist.github.com/yoavniran/1e3b0162e1545055429e
*      http://sinonjs.org/docs/
*      https://mochajs.org/
*/
const expect = chai.expect;
const spy = sinon.spy;
const stub = sinon.stub;

import <%= camelName %>Model from './<%= lispName %>.model';
import baseModel from '<%= srcRootRelativePath %>/common/models/base.model';

beforeEach(angular.mock.module(($provide) => {
  $provide.factory('BaseModel', baseModel);
  $provide.factory('<%= camelCapName %>', <%= camelName %>Model);
}));

describe('<%= camelCapName %> model', () => {
  let Klass;
  let BaseKlass;
  let model;
  let baseModelStub;

  beforeEach(inject((_<%= camelCapName %>_, _BaseModel_) => {
    Klass = _<%= camelCapName %>_;
    BaseKlass = _BaseModel_;
    model = new Klass();
  }));

  it('inherited from BaseModel class', () => {
    expect(model).to.be.instanceOf(Klass);
    expect(model).to.be.instanceOf(BaseKlass);
  });
});
