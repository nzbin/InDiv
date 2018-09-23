import "reflect-metadata";

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
export function Injectable(options?: TInjectableOptions): (_constructor: Function) => void {
    return function (_constructor: Function): void {
        if (options && options.isSingletonMode) (_constructor as any).isSingletonMode = options.isSingletonMode;
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

/**
 * Decorator @Injected
 * declare Class which need be injected
 *
 * @export
 * @param {Function} _constructor
 */
export function Injected(_constructor: Function): void {
    // 通过反射机制，获取参数类型列表
    const paramsTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', _constructor);
    if (paramsTypes.length) {
        paramsTypes.forEach((v, i) => {
            if (v === _constructor) {
                throw new Error('不可以依赖自身');
            } else {
                const service = v.name;
                if ((_constructor as any)._needInjectedClass) {
                    (_constructor as any)._needInjectedClass.push(service);
                } else {
                    (_constructor as any)._needInjectedClass = [service];
                }
            }
        });
    }
}

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
    if ((_constructor as any)._needInjectedClass) {
        (_constructor as any)._needInjectedClass.forEach((arg: string) => {
            const _service = (_constructor as any)._injectedProviders.has(arg) ? (_constructor as any)._injectedProviders.get(arg) : _module.$providers.find((service: Function) => service.constructor.name === arg);
            if (_service) args.push(factoryCreator(_service, _module));
        });
    }
    if (!(_constructor as any)._needInjectedClass) {
        const CLASS_ARGUS = /^function\s+[^\(]*\(\s*([^\)]*)\)/m;
        const argList = _constructor.toString().match(CLASS_ARGUS)[1].replace(/ /g, '').split(',');
        argList.forEach((arg: string) => {
            const serviceName = arg.replace(/\n/g, '');
            const argu = `${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}`;
            const _service = (_constructor as any)._injectedProviders.has(argu) ? (_constructor as any)._injectedProviders.get(argu) : _module.$providers.find((service: Function) => service.constructor.name === argu);
            if (_service) args.push(factoryCreator(_service, _module));
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
