import { TProviders } from '../types';
import { rootInjector, Injector } from './injector';
import { buildPrivateInjector } from './build-private-injector';

/**
 * injectionCreator: build arguments for factoryCreator
 * 
 * 1. provider constructor's providers
 * 2. provider rootInjector
 * 3. provider otherInjector
 *
 * first: check _constructor has constructor private Injector or not
 * secend: find service in otherInjector or rootInjector
 * third: find service is a singleton service or not
 * forth: if service is a singleton service, find in rootInjector. If not use factoryCreator instance and return
 * last: if service is a singleton service, and can't be found in rootInjector, then factoryCreator instance and push in rootInjector
 *
 * @export
 * @param {Function} _constructor
 * @param {Injector} [otherInjector]
 * @param {Map<any, any>} [provideAndInstanceMap]
 * @returns {{ args: any[], privateInjector?: Injector }}
 */
export function injectionCreator(_constructor: Function, otherInjector?: Injector, provideAndInstanceMap?: Map<any, any>): { args: any[], privateInjector?: Injector } {
    const args: any[] = [];

    let _needInjectedClass: any[] = [];
    if ((_constructor as any)._needInjectedClass) _needInjectedClass = (_constructor as any)._needInjectedClass;
    if ((_constructor as any).injectTokens) _needInjectedClass = (_constructor as any).injectTokens;

    if (_needInjectedClass.length === 0) return { args };

    // build privateInjector
    let privateInjector: Injector;
    if ((_constructor.prototype as any).privateProviders as TProviders) privateInjector = buildPrivateInjector((_constructor.prototype as any).privateProviders as TProviders);

    _needInjectedClass.forEach((key: Function) => {
        // inject internal type for NvModule
        if (provideAndInstanceMap && provideAndInstanceMap.has(key)) return args.push(provideAndInstanceMap.get(key));

        // private injector of instance
        if (privateInjector) {
            const _constructorService = privateInjector.getProvider(key);
            if (_constructorService && !_constructorService.useClass && !_constructorService.useValue) return args.push(factoryCreator(_constructorService, otherInjector, provideAndInstanceMap));
            if (_constructorService && _constructorService.useClass) return args.push(factoryCreator(_constructorService.useClass, otherInjector, provideAndInstanceMap));
            if (_constructorService && _constructorService.useValue) return args.push(_constructorService.useValue);
        }

        // injector: find service Class in otherInjector or rootInjector
        let _service = null;
        let fromInjector = null;
        // otherInjector first
        if (otherInjector && otherInjector.getProvider(key)) {
            _service = otherInjector.getProvider(key);
            fromInjector = otherInjector;
        } else if (rootInjector && rootInjector.getProvider(key)) {
            _service = rootInjector.getProvider(key);
            fromInjector = rootInjector;
        } else throw new Error(`injector injects service error: can't find provide: ${key.name} in constructor ${_constructor}`);

        let findService = null;
        if (_service && !_service.useClass && !_service.useValue) findService = _service;
        if (_service && _service.useClass) findService = _service.useClass;
        if (_service && _service.useValue) return args.push(_service.useValue);

        if (!findService) throw new Error(`injector injects service error: can't find provide: ${key.name} in constructor ${_constructor}`);

        // if service isn't a singleton service
        if (findService.isSingletonMode === false) return args.push(factoryCreator(findService, otherInjector, provideAndInstanceMap));
        // if service is a singleton service
        else {
            const findServiceInStance = fromInjector.getInstance(key);
            if (findServiceInStance) args.push(findServiceInStance);
            else {
                const serviceInStance = factoryCreator(findService, otherInjector, provideAndInstanceMap);
                fromInjector.setInstance(key, serviceInStance);
                args.push(serviceInStance);
            }
        }
    });

    return { args, privateInjector };
}

/**
 * create an instance with factory method
 * 
 * use injectedServiceCreator to create arguments from Injector
 *
 * @export
 * @template K
 * @template V
 * @param {Function} _constructor
 * @param {Injector} [otherInjector]
 * @param {Map<K, V>} [provideAndInstanceMap]
 * @returns {*}
 */
export function factoryCreator<K = any, V = any>(_constructor: Function, otherInjector?: Injector, provideAndInstanceMap?: Map<K, V>): any {
    const { args, privateInjector } = injectionCreator(_constructor, otherInjector, provideAndInstanceMap);
    const factoryInstance = new (_constructor as any)(...args);
    factoryInstance.privateInjector = privateInjector;
    return factoryInstance;
}
