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
  };
}

export default Service;
