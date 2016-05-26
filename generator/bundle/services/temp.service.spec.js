/*eslint no-unused-expressions: "off"*/
/*eslint no-unused-vars: "off"*/
/*global describe it beforeEach inject expect angular mocks*/
import <%= camelCapName %>Service from './<%= lispName %>.service';

describe(' <%= dotedCamelCapFullName %> service', () => {
  const service = new <%= camelCapName %>Service;

  beforeEach(inject(() => {
  }));


  it('service is instance of <%= camelName %>Service', () => {
    expect(service).to.be.an.instanceof(<%= camelCapName %>Service);
  });
});
