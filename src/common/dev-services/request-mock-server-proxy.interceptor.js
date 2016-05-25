
export default ($q) => {
  'ngInject';

  let backendServerUrl = process.env.BACKEND_SERVER_URL;
  backendServerUrl = backendServerUrl.replace(/\/+$/, ''); //remove trailing '/'

  function request(cfg) {
    console.log(cfg);
    let fileSuffix = '';
    if (cfg.method !== 'GET') {
      fileSuffix += '.' + cfg.method + '';
      cfg.method = 'GET';
    }

    let url = cfg.url.replace(/^\/+/, '');
    if (backendServerUrl) {
      url = backendServerUrl + '/' + url;
    } else {
      url = '/' + process.env.MOCK_SERVER_DIR + '/' + url + fileSuffix + '.json';
    }

    cfg.url = url;
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

