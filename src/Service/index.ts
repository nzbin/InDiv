import Http from '../Http';

class Service {
  public static isSingletonMode?: boolean;
  public static instance?: Service = null;
  public static _injectedProviders?: Map<string, Service> = new Map();

  public $http?: Http;

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

  public static getInstance?(args?: any[]) {
    const Instance = this;
    if (!this.isSingletonMode) return Reflect.construct(Instance, args);
    if (this.isSingletonMode) {
      if (!this.instance) this.instance = Reflect.construct(Instance, args);
      return this.instance;
    }
  }
}

export default Service;
