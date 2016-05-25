import angular from 'angular';

class ConfigService {
  constructor(config) {
    'ngInject';
    this.config = config;
  }

  get(key) {
    if (key) {
      return this.config[key];
    } else {
      return this.config;
    }
  }
}

export default () => {
  let config = {};

  function mergeConfig(cfg) {
    config = angular.merge(config, cfg);
  }

  function $get() {
    return new ConfigService(config);
  }

  return {
    mergeConfig,
    $get,
  };
};
