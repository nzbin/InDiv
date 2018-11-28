import { Injector } from './injector';
/**
 * injector: build arguments for factoryCreator
 *
 * 1. provider constructor's providers
 * 2. provider rootInjector
 * 3. provider otherInjector
 *
 * first: check _constructor has constructor private Injector($providerList) or not
 * secend: find service in otherInjector or rootInjector
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
export declare function inject(_constructor: Function, otherInjector?: Injector, provideAndInstanceMap?: Map<any, any>): any[];
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
export declare function factoryCreator<K = any, V = any>(_constructor: Function, otherInjector?: Injector, provideAndInstanceMap?: Map<K, V>): any;
