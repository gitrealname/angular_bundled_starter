
export default class CurrentTime {
  constructor() {
    'ngInject';
  }

  getTime() {
    return new Date();
  }
}

