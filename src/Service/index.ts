import Http from '../Http';

// class Service {
//   public static isSingletonMode?: boolean;
//   public static instance?: Service = null;
//   public static _injectedProviders?: Map<string, Service> = new Map();

//   public $http?: Http;

//   constructor() {
//     const _http = new Http();
//     this.$http = {
//       $get: _http.$get,
//       $delete: _http.$delete,
//       $post: _http.$post,
//       $put: _http.$put,
//       $patch: _http.$patch,
//     };
//   }

//   public static getInstance?(args?: any[]) {
//     const Instance = this;
//     if (!this.isSingletonMode) return Reflect.construct(Instance, args);
//     if (this.isSingletonMode) {
//       if (!this.instance) this.instance = Reflect.construct(Instance, args);
//       return this.instance;
//     }
//   }
// }
type TServiceOptions = {
  isSingletonMode?: boolean;
};

function Service(options?: TServiceOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    if (options && options.isSingletonMode) (_constructor as any).isSingletonMode = options.isSingletonMode;
    (_constructor as any).instance = null;
    (_constructor as any)._injectedProviders = new Map();
    (_constructor as any).getInstance = function (args?: any[]) {
      const Instance = this;
      if (!this.isSingletonMode) return Reflect.construct(Instance, args);
      if (this.isSingletonMode) {
        if (!this.instance) this.instance = Reflect.construct(Instance, args);
        return this.instance;
      }
    };

    const _http = new Http();
    (_constructor as any).prototype.$http = {
      $get: _http.$get,
      $delete: _http.$delete,
      $post: _http.$post,
      $put: _http.$put,
      $patch: _http.$patch,
    };
  };
}

export default Service;
