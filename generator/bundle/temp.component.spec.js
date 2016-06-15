/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
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

import <%= camelName %>Module from './';
import <%= camelName %>Component, { <%= camelCapName %>Controller } from './<%= lispName %>.component';
import <%= camelName %>Template from './<%= lispName %>.html';

class FakeConfigService {
  get(key) {
    return {
      description: '<%= camelFullName %> description',
    };
  }
}

describe(' <%= dotedCamelCapFullName %> component', () => {
  let $rootScope;
  let makeController;

  beforeEach(window.module(<%= camelName %>Module.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new <%= camelCapName %>Controller(undefined, new FakeConfigService());
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      const controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(<%= camelName %>Template).to.match(/{{\s?vm\.name\s?}}/g);
    });
  });

  describe('Component', () => {
    // component/directive specs
    const component = <%= camelName %>Component;

    it('includes the intended template', () => {
      expect(component.template).to.equal(<%= camelName %>Template);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(<%= camelCapName %>Controller);
    });
  });
});
