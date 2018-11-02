import { INvModule } from '../types';
/**
 * create an NvModule instance with factory method
 *
 * first build service and components in Function.prototype
 * then use factoryCreator create and NvModule instance
 *
 * @export
 * @param {Function} NM
 * @returns {INvModule}
 */
export declare function factoryModule(NM: Function): INvModule;
