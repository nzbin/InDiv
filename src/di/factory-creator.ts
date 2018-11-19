import { IComponent } from '../types';

import { rootInjector, Injector } from './injector';

/**
 * injector: build arguments for factoryCreator
 * 
 * 1. provider Component's providers
 * 2. provider rootInjector
 * 3. provider otherInjector
 *
 * first: check _constructor has Component providers or not
 * secend: find service in loadModule or rootModule
 * third: find service is a singleton service or not
 * forth: if service is a singleton service, find in rootModule's $providerInstances. If not use factoryCreator instance and return
 * last: if service is a singleton service, and can't be found in rootModule's $providerInstances, then factoryCreator instance and push in rootModule's $providerInstances
 *
 * @export
 * @param {Function} _constructor
 * @param {Injector} [otherInjector]
 * @param {Map<any, any>} [provideAndInstanceMap]
 * @returns {any[]}
 */
export function inject(_constructor: Function, otherInjector?: Injector, provideAndInstanceMap?: Map<any, any>): any[] {
    const args: any[] = [];

    let _needInjectedClass: any[] = [];
    if ((_constructor as any)._needInjectedClass) _needInjectedClass = (_constructor as any)._needInjectedClass;
    if ((_constructor as any).injectTokens) _needInjectedClass = (_constructor as any).injectTokens;

    if (_needInjectedClass.length === 0) return args;

    _needInjectedClass.forEach((key: Function) => {
        // inject InDiv instance fro NvModule
        if (provideAndInstanceMap && provideAndInstanceMap.has(key)) return args.push(provideAndInstanceMap.get(key));

        // component injector: find service Class in providerList in Component
        if ((_constructor.prototype as IComponent).$providerList) {
            const _componentService = (_constructor.prototype as IComponent).$providerList.get(key);
            if (_componentService && !_componentService.useClass && !_componentService.useValue) return args.push(factoryCreator(_componentService, otherInjector, provideAndInstanceMap));
            if (_componentService && _componentService.useClass) return args.push(factoryCreator(_componentService.useClass, otherInjector, provideAndInstanceMap));
            if (_componentService && _componentService.useValue) return args.push(_componentService.useValue);
        }

        // root injector: find service Class in otherInjector or rootInjector
        let _service = null;
        let fromInjector = null;
        // otherInjector first
        if (otherInjector && otherInjector.getProvider(key)) {
            _service = otherInjector.getProvider(key);
            fromInjector = otherInjector;
        } else if (rootInjector && rootInjector.getProvider(key)) {
            _service = rootInjector.getProvider(key);
            fromInjector = rootInjector;
        } else throw new Error(`injector injects service error: can't find provide: ${key.name} in Component ${_constructor}`);

        let findService = null;
        if (_service && !_service.useClass && !_service.useValue) findService = _service;
        if (_service && _service.useClass) findService = _service.useClass;
        if (_service && _service.useValue) return args.push(_service.useValue);

        if (!findService) throw new Error(`injector injects service error: can't find provide: ${key.name} in Component ${_constructor}`);

        // if service isn't a singleton service
        if (findService && !findService.isSingletonMode) args.push(factoryCreator(findService, otherInjector, provideAndInstanceMap));

        // if service is a singleton service
        if (findService && findService.isSingletonMode) {
            const findServiceInStance = fromInjector.getInstance(key) ? fromInjector.getInstance(key) : null;
            if (findServiceInStance) args.push(findServiceInStance);
            if (!findServiceInStance) {
                const serviceInStance = factoryCreator(findService, otherInjector, provideAndInstanceMap);
                fromInjector.setInstance(key, serviceInStance);
                args.push(serviceInStance);
            }
        }
    });

    return args;
}

/**
 * create an instance with factory method
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
    const args = inject(_constructor, otherInjector, provideAndInstanceMap);
    const factoryInstance = Reflect.construct(_constructor, args);
    return factoryInstance;
}
