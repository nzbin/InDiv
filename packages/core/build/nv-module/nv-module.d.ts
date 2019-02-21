import { TUseClassProvider, TUseValueProvider } from '../types';
export declare type TNvModuleOptions = {
    imports?: Function[];
    declarations?: Function[];
    providers?: (Function | TUseClassProvider | TUseValueProvider)[];
    exports?: Function[];
    bootstrap?: Function;
};
/**
 * Decorator @NvModule
 *
 * to decorate an InDiv NvModule
 * @NvModule is injectable, and will be injected in rootInjector
 * you can use NvModule as injectable token to get singleton instance of @NvModule in constructor
 *
 * @export
 * @param {TNvModuleOptions} options
 * @returns {(_constructor: Function) => void}
 */
export declare function NvModule(options: TNvModuleOptions): (_constructor: Function) => void;
