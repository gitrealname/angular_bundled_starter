/// <reference path="<%= rootRelativePath %>typings/index.d.ts" />
/*eslint no-unused-expressions: "off"*/
/*eslint no-unused-vars: "off"*/
/*global describe it beforeEach inject expect angular mocks sinon chai*/

/*
* Useful links regarding unit-testing:
* See: https://gist.github.com/yoavniran/1e3b0162e1545055429e
*      http://sinonjs.org/docs/
*      https://github.com/domenic/sinon-chai
*/
const expect = chai.expect;
const spy = sinon.spy;
const stub = sinon.stub;

import <%= camelName %>Directive from './<%= lispName %>.directive';
import <%= camelName %>Template from './<%= lispName %>.html';

beforeEach(angular.mock.module(($provide) => {
  // ...
}));

describe('<%= dotedCamelCapFullName %> directive', () => {
  let $rootScope;

  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
  }));

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
  });

  describe('Directive', () => {
    let directive;
    // directive specs
    beforeEach(inject(() => {
      directive = <%= camelName %>Directive();
    }));

    it('includes the intended template', () => {
      expect(directive.template).to.equal(<%= camelName %>Template);
    });
  });
});
