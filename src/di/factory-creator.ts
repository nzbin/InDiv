import { IComponent } from '../types';

import { internalDependence } from './factory-utils';

/**
 * injector: build arguments for factoryCreator
 * 
 * 1. provider Component's providers
 * 2. provider loadModule's providers
 * 3. provider rootModule's providers
 *
 * first: check _constructor has Component providers or not
 * secend: find service in loadModule or rootModule
 * third: find service is a singleton service or not
 * forth: if service is a singleton service, find in rootModule's $providerInstances. If not use factoryCreator instance and return
 * last: if service is a singleton service, and can't be found in rootModule's $providerInstances, then factoryCreator instance and push in rootModule's $providerInstances
 *
 * @export
 * @param {Function} _constructor
 * @param {*} rootModule
 * @param {*} [loadModule]
 * @returns {any[]}
 */
export function injector(_constructor: Function, rootModule: any, loadModule?: any): any[] {
    const args: any[] = [];
    // for ts Dependency Injection
    if ((_constructor as any)._needInjectedClass) {
        (_constructor as any)._needInjectedClass.forEach((key: Function) => {
            // inject InDiv instance fro NvModule
            const arg = internalDependence(_constructor, key, rootModule, loadModule);
            if (arg) return args.push(arg);

            // component injector: find service Class in providerList in Component
            if ((_constructor.prototype as IComponent).$providerList) {
                const _componentService = (_constructor.prototype as IComponent).$providerList.get(key);
                if (_componentService && !_componentService.useClass && !_componentService.useValue) return args.push(factoryCreator(_componentService, rootModule, loadModule));
                if (_componentService && _componentService.useClass) return args.push(factoryCreator(_componentService.useClass, rootModule, loadModule));
                if (_componentService && _componentService.useValue) return args.push(_componentService.useValue);
            }

            // root injector: find service Class in _injectedProviders in loadModule or rootModule
            let _service = null;
            let fromModule = null;
            // loadModule first
            if (loadModule && loadModule.$providerList.has(key)) {
                _service = loadModule.$providerList.get(key);
                fromModule = loadModule;
            } else if (rootModule && rootModule.$providerList.has(key)) {
                _service = rootModule.$providerList.get(key);
                fromModule = rootModule;
            } else throw new Error(`injector injects service error: can't find provide: ${key.name} in Component ${_constructor}`);

            let findService = null;
            if (_service && !_service.useClass && !_service.useValue) findService = _service;
            if (_service && _service.useClass) findService = _service.useClass;
            if (_service && _service.useValue) return args.push(_service.useValue);

            if (!findService) throw new Error(`injector injects service error: can't find provide: ${key.name} in Component ${_constructor}`);

            // if service isn't a singleton service
            if (findService && !findService.isSingletonMode) args.push(factoryCreator(findService, rootModule, fromModule));

            // if service is a singleton service
            if (findService && findService.isSingletonMode) {
                // if root injector: $providerInstances has this key
                const findServiceInStance = fromModule.$providerInstances.has(key) ? fromModule.$providerInstances.get(key) : null;
                if (findServiceInStance) args.push(findServiceInStance);
                if (!findServiceInStance) {
                    const serviceInStance = factoryCreator(findService, rootModule, fromModule);
                    fromModule.$providerInstances.set(key, serviceInStance);
                    args.push(serviceInStance);
                }
            }
        });
    }

    // for js Dependency Injection
    if ((_constructor as any).injectTokens) {
        (_constructor as any).injectTokens.forEach((key: string) => {
            // inject InDiv instance fro NvModule
            const arg = internalDependence(_constructor, key, rootModule, loadModule);
            if (arg) return args.push(arg);

            // component injector: find service Class in providerList in Component
            if ((_constructor.prototype as IComponent).$providerList) {
                const _componentService = (_constructor.prototype as IComponent).$providerList.get(key);
                if (_componentService && !_componentService.useClass && !_componentService.useValue) throw new Error(`injector injects service error: can't find provide: ${key} in Component ${_constructor}`);
                if (_componentService && _componentService.useClass) return args.push(factoryCreator(_componentService.useClass, rootModule, loadModule));
                if (_componentService && _componentService.useValue) return args.push(_componentService.useValue);
            }

            // root injector: find service Class in _injectedProviders in in loadModule or rootModule
            let _service = null;
            let fromModule = null;
            // loadModule first
            if (loadModule && loadModule.$providerList.has(key)) {
                _service = loadModule.$providerList.get(key);
                fromModule = loadModule;
            } else if (rootModule && rootModule.$providerList.has(key)) {
                _service = rootModule.$providerList.get(key);
                fromModule = rootModule;
            } else throw new Error(`injector injects service error: can't find provide: ${key} in Component ${_constructor}`);

            let findService = null;
            if (_service && !_service.useClass && !_service.useValue) throw new Error(`injector injects service error: can\'t find provide: ${key} in Component ${_constructor}`);
            if (_service && _service.useClass) findService = _service.useClass;
            if (_service && _service.useValue) return args.push(_service.useValue);

            if (!findService) throw new Error(`injector injects service error: can't find provide: ${key} in Component ${_constructor}`);

            // if service isn't a singleton service
            if (findService && !findService.isSingletonMode) args.push(factoryCreator(findService, rootModule, fromModule));

            // if service is a singleton service
            if (findService && findService.isSingletonMode) {
                const findServiceInStance = rootModule.$providerInstances.has(key) ? rootModule.$providerInstances.get(key) : null;
                if (findServiceInStance) args.push(findServiceInStance);
                if (!findServiceInStance) {
                    const serviceInStance = factoryCreator(findService, rootModule, fromModule);
                    fromModule.$providerInstances.set(key, serviceInStance);
                    args.push(serviceInStance);
                }
            }
        });
    }
    return args;
}

/**
 * create an instance with factory method
 *
 * @export
 * @param {Function} _constructor
 * @param {*} rootModule
 * @param {*} [loadModule]
 * @returns {*}
 */
export function factoryCreator(_constructor: Function, rootModule: any, loadModule?: any): any {
    const args = injector(_constructor, rootModule, loadModule);
    const factoryInstance = Reflect.construct(_constructor, args);
    return factoryInstance;
}
