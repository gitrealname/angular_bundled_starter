/*eslint no-unused-expressions: "off"*/
/*eslint no-unused-vars: "off"*/
/*global describe it beforeEach inject expect angular mocks*/
import AboutModule from './';
import AboutComponent, { AboutController } from './about.component';
import AboutTemplate from './about.html';

describe('Test.About component', () => {
  let $rootScope;
  let makeController;

  beforeEach(window.module(AboutModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new AboutController();
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
      expect(AboutTemplate).to.match(/{{\s?vm\.name\s?}}/g);
    });
  });

  describe('Component', () => {
    // component/directive specs
    const component = AboutComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(AboutTemplate);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(AboutController);
    });
  });
});
