import Http from './Http';

class Service {
  static getInstance() {
    if (!this.instance) {
      const Instance = this;
      this.instance = new Instance();
    }
    return this.instance;
  }

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

export default Service;
