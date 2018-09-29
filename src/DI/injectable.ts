type TInjectableOptions = {
  isSingletonMode?: boolean;
};

/**
 * Decorator @Injectable
 * 
 * to decorate an InDiv Service
 *
 * @param {TInjectableOptions} [options]
 * @returns {(_constructor: Function) => void}
 */
export default function Injectable(options?: TInjectableOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
      (_constructor as any).isSingletonMode = true;
      if (options) (_constructor as any).isSingletonMode = options.isSingletonMode;
      (_constructor as any).instance = null;
      (_constructor as any)._injectedProviders = new Map();
      (_constructor as any).getInstance = (args?: any[]) => {
          if (!(_constructor as any).isSingletonMode) return Reflect.construct(_constructor, args);
          if ((_constructor as any).isSingletonMode) {
              if (!(_constructor as any).instance) (_constructor as any).instance = Reflect.construct(_constructor, args);
              return (_constructor as any).instance;
          }
      };
  };
}
