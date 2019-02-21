import { INvModule } from '../types';
import { Injector } from '../di';
/**
 * get NvModule instance from rootInjector
 *
 * use this method get NvModule instance, if want to get it from rootInjector as singleton instance
 *
 * @export
 * @param {Function} FindNvModule
 * @param {Injector} [otherInjector]
 * @returns {INvModule}
 */
export declare function getModuleFromRootInjector(FindNvModule: Function, otherInjector?: Injector): INvModule;
/**
 * create an NvModule instance with factory method
 *
 * first build service and components in Function.prototype
 * then use factoryCreator create and NvModule instance
 *
 * @export
 * @param {Function} NM
 * @param {Injector} [otherInjector]
 * @returns {INvModule}
 */
export declare function factoryModule(NM: Function, otherInjector?: Injector): INvModule;
