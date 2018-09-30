import { IComponent } from '../types';
/**
 * injector: build arguments for factoryCreator
 * 
 * 1. provider Component's providers
 * 2. provider rootModule's providers
 * 
 * first: check _constructor has Component providers or not
 * secend: find service is a singleton service or not
 * third: if service is a singleton service, find in rootModule's $providerInstances. If not use factoryCreator instance and return
 * last: if service is a singleton service, and can't be found in rootModule's $providerInstances, then factoryCreator instance and push in rootModule's $providerInstances
 *
 * @export
 * @param {Function} _constructor
 * @param {*} rootModule
 * @returns {any[]}
 */
export function injector(_constructor: Function, rootModule: any): any[] {
    const args: any[] = [];
    // for ts Dependency Injection
    if ((_constructor as any)._needInjectedClass) {
        (_constructor as any)._needInjectedClass.forEach((key: Function) => {
            // component injector: find service Class in providerList in Component
            if ((_constructor.prototype as IComponent).$providerList) {
                const _componentService = (_constructor.prototype as IComponent).$providerList.get(key);
                if (_componentService && !_componentService.useClass && !_componentService.useValue) return args.push(factoryCreator(_componentService, rootModule));
                if (_componentService && _componentService.useClass) return args.push(factoryCreator(_componentService.useClass, rootModule));
                if (_componentService && _componentService.useValue) return args.push(_componentService.useValue);
            }

            // root injector: find service Class in _injectedProviders in rootModule
            const _service = (_constructor as any)._injectedProviders.has(key) ? (_constructor as any)._injectedProviders.get(key) : rootModule.$providers.find((service: any) => {
                if (!service.provide && service === key) return true;
                if (service.provide && service.provide === key) return true;
                return false;
            });

            let findService = null;
            if (_service && !_service.useClass && !_service.useValue) findService = _service;
            if (_service && _service.useClass) findService = _service.useClass;
            if (_service && _service.useValue) return args.push(_service.useValue);

            if (!findService) return console.error('injector injects service error: can\'t find provide: ', key.name);
            
            // if service isn't a singleton service
            if (findService && !findService.isSingletonMode) args.push(factoryCreator(findService, rootModule));

            // if service is a singleton service
            if (findService && findService.isSingletonMode) {
                // if root injector: $providerInstances has this key
                const findServiceInStance = rootModule.$providerInstances.has(key) ? rootModule.$providerInstances.get(key) : null;
                if (findServiceInStance) args.push(findServiceInStance);
                if (!findServiceInStance) {
                    const serviceInStance = factoryCreator(findService, rootModule);
                    rootModule.$providerInstances.set(key, serviceInStance);
                    args.push(serviceInStance);
                }
            }
        });
    }

    // for js Dependency Injection
    if ((_constructor as any).injectTokens) {
        (_constructor as any).injectTokens.forEach((key: string) => {
            // component injector: find service Class in providerList in Component
            if ((_constructor.prototype as IComponent).$providerList) {
                const _componentService = (_constructor.prototype as IComponent).$providerList.get(key);
                if (_componentService && !_componentService.useClass && !_componentService.useValue) return console.error('injector injects service error: can\'t find provide: ', key, ` in Component ${_constructor}`);
                if (_componentService && _componentService.useClass) return args.push(factoryCreator(_componentService.useClass, rootModule));
                if (_componentService && _componentService.useValue) return args.push(_componentService.useValue);
            }

            // root injector: find service Class in _injectedProviders in rootModule
            const _service = (_constructor as any)._injectedProviders.has(key) ? (_constructor as any)._injectedProviders.get(key) : rootModule.$providers.find((service: any) => {
                if (service.provide && service.provide === key) return true;
                return false;
            });

            let findService = null;
            if (_service && !_service.useClass && !_service.useValue) return console.error('injector injects service error: can\'t find provide: ', key);
            if (_service && _service.useClass) findService = _service.useClass;
            if (_service && _service.useValue) return args.push(_service.useValue);

            if (!findService) return console.error('injector injects service error: can\'t find provide:', key);

            // if service isn't a singleton service
            if (findService && !findService.isSingletonMode) args.push(factoryCreator(findService, rootModule));

            // if service is a singleton service
            if (findService && findService.isSingletonMode) {
                const findServiceInStance = rootModule.$providerInstances.has(key) ? rootModule.$providerInstances.get(key) : null;
                if (findServiceInStance) args.push(findServiceInStance);
                if (!findServiceInStance) {
                    const serviceInStance = factoryCreator(findService, rootModule);
                    rootModule.$providerInstances.set(key, serviceInStance);
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
 * @returns {*}
 */
export function factoryCreator(_constructor: Function, rootModule: any): any {
    const args = injector(_constructor, rootModule);
    const factoryInstance = Reflect.construct(_constructor, args);
    return factoryInstance;
}
