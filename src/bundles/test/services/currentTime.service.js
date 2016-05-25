
export default class CurrentTimeService {
  constructor() {
    'ngInject';
  }

  getTime() {
    return new Date();
  }
}

