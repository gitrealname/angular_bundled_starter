
export default ($q) => {
  'ngInject';

  function request(cfg) {
    console.log(cfg);
    let fileSuffix = '';
    if (cfg.method !== 'GET') {
      fileSuffix += '.' + cfg.method + '';
      cfg.method = 'GET';
    }

    //cfg.url = '/' + process.env.MOCK_SERVER + '/'
    cfg.url = '/' + 'mock.server' + '/'
      + cfg.url.replace(/^\/+/, '')
      + fileSuffix
      + '.json';

    return cfg;
  }

  function requestError(err) {
    return $q.reject(err);
  }

  function response(resp) {
    return resp;
  }

  function responseError(rejection) {
    return $q.reject(rejection);
  }

  return {
    request,
    requestError,
    response,
    responseError,
  };
};

