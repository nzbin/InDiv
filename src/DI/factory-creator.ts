/**
 * injector: build arguments for factoryCreator
 *
 * @export
 * @param {Function} _constructor
 * @param {*} _module
 * @returns {any[]}
 */
export function injector(_constructor: Function, _module: any): any[] {
  const args: Function[] = [];

  // for ts Dependency Injection
  if ((_constructor as any)._needInjectedClass) {
      (_constructor as any)._needInjectedClass.forEach((arg: Function) => {
          const _service = (_constructor as any)._injectedProviders.has(arg) ? (_constructor as any)._injectedProviders.get(arg) : _module.$providers.find((service: Function) => service === arg);
          if (_service && _service.useClass) args.push(factoryCreator(_service.useClass, _module));
          if (_service && _service.useValue) args.push(_service.useValue);
          if (_service && !_service.useClass && !_service.useValue) args.push(factoryCreator(_service, _module));
      });
  }

  // for js Dependency Injection
  if ((_constructor as any).injectTokens) {
      (_constructor as any).injectTokens.forEach((arg: string) => {
          const _service = (_constructor as any)._injectedProviders.has(arg) ? (_constructor as any)._injectedProviders.get(arg) : _module.$providers.find((service: any) => {
              if (service.provide && service.provide === arg) return true;
              return false;
          });
          if (_service && _service.useClass) args.push(factoryCreator(_service.useClass, _module));
          if (_service && _service.useValue) args.push(_service.useValue);
      });
  }
  return args;
}

/**
 * create an instance with factory method
 *
 * @export
 * @param {Function} _constructor
 * @param {*} _module
 * @returns {*}
 */
export function factoryCreator(_constructor: Function, _module: any): any {
  const args = injector(_constructor, _module);
  let factory = Reflect.construct(_constructor, args);
  if ((_constructor as any).isSingletonMode) factory = (_constructor as any).getInstance(args);
  return factory;
}
