import { IService, IHttp  } from './types';

import Http from '../Http';

class Service implements IService {
  static isSingletonMode: boolean;
  static instance: IService = null;

  $http: IHttp;

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

  static getInstance() {
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
