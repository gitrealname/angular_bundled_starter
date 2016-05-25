/*eslint no-unused-expressions: "off"*/
/*eslint no-unused-vars: "off"*/
/*global describe it beforeEach inject expect angular mocks*/
import CurrentTimeService from './currentTime.service';

describe('Test.CurrentTime service', () => {
  /** @type {CurrentTime} */
  let currentTime;

  beforeEach(() => {
    currentTime = new CurrentTimeService();
  });

  it('<to be implemented>', () => {
    expect(true).to.be.true;
  });
});
