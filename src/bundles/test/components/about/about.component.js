import './about.styl';
import template from './about.html';

export class AboutController {
  constructor() {
    'ngInject';
    //initialize

    //public
    this.name = 'about';

    //private
  }

  /*
  * Event handlers
  */
  $onInit() {
    console.log(`component '${this.name}' activated.`);
  }

  $onDestroy() {
    console.log(`component '${this.name}' destroyed.`);
  }

  /*
  * Methods
  */
} // AboutController

export default {
  bindings: {},
  transclude: false,
  template,
  controller: AboutController,
  controllerAs: 'vm',
};
