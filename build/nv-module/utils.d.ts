import { INvModule } from '../types';
import { Injector } from '../di';
import { InDiv } from '../indiv';
/**
 * create an NvModule instance with factory method
 *
 * first build service and components in Function.prototype
 * then use factoryCreator create and NvModule instance
 *
 * @export
 * @param {Function} NM
 * @param {Injector} [otherInjector]
 * @param {InDiv} [indivInstance]
 * @returns {INvModule}
 */
export declare function factoryModule(NM: Function, otherInjector?: Injector, indivInstance?: InDiv): INvModule;
