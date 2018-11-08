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
export declare function injector(_constructor: Function, rootModule: any, loadModule?: any): any[];
/**
 * create an instance with factory method
 *
 * @export
 * @param {Function} _constructor
 * @param {*} rootModule
 * @param {*} [loadModule]
 * @returns {*}
 */
export declare function factoryCreator(_constructor: Function, rootModule: any, loadModule?: any): any;
