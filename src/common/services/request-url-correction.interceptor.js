
export default () => {
  'ngInject';

  function request(cfg) {
    let url = cfg.url;
    //if url is relative, make sure it doesn't contain forward '/'
    if (!url.match(/^(http|https|file|ftp):\/\//)) {
      url = url.replace(/^\/+/, '');
    }
    cfg.url = url;
    return cfg;
  }

  return {
    request,
  };
};

