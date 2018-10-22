import { INvModule, TUseClassProvider, TuseValueProvider } from '../types';
declare type TNvModuleOptions = {
    imports?: Function[];
    components: Function[];
    providers?: (Function | TUseClassProvider | TuseValueProvider)[];
    exports?: Function[];
    bootstrap?: Function;
};
/**
 * Decorator @NvModule
 *
 * to decorate an InDiv NvModule
 *
 * @export
 * @param {TNvModuleOptions} options
 * @returns {(_constructor: Function) => void}
 */
export declare function NvModule(options: TNvModuleOptions): (_constructor: Function) => void;
/**
 * create an NvModule instance with factory method
 *
 * @export
 * @param {Function} NM
 * @returns {INvModule}
 */
export declare function factoryModule(NM: Function): INvModule;
export {};
