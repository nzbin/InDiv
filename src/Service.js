const Http = require('./Http');

class Service {
  constructor() {
    const _http = new Http();
    this.$http = {
      $get: _http.$get,
      $delete: _http.$delete,
      $post: _http.$post,
      $put: _http.$put,
      $patch: _http.$patch,
    };
  }
}

module.exports = Service;
