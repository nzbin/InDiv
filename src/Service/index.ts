import Http from '../Http';

class Service {
  public static isSingletonMode: boolean;
  public static instance: Service = null;

  public $http: Http;

  private constructor() {
    const _http = new Http();
    this.$http = {
      $get: _http.$get,
      $delete: _http.$delete,
      $post: _http.$post,
      $put: _http.$put,
      $patch: _http.$patch,
    };
  }

  public static getInstance() {
    const Instance = this;
    if (!this.isSingletonMode) {
      return new Instance();
    }
    if (this.isSingletonMode) {
      if (!this.instance) {
        this.instance = new Instance();
      }
      return this.instance;
    }
  }
}

export default Service;
